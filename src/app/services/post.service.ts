import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    firstValueFrom,
    Observable,
    take,
    tap,
    throwError,
} from 'rxjs';
import { Post } from '../models/post.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user.model';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Comment } from '../models/comment.model.';
import { ref } from 'firebase/database';

@Injectable({
    providedIn: 'root',
})
export class PostService {
    constructor(
        private db: AngularFirestore,
        private authService: AuthService,
        private imageCompress: NgxImageCompressService,
    ) {}

    private _posts$ = new BehaviorSubject<Post[]>([]);
    public posts$ = this._posts$.asObservable();

    async getPosts() {
        const loggedInUser = this.authService.getLoggedInUser();
        if (!loggedInUser) return;

        const loggedInUserFromDB$ = this.db
            .collection('users')
            .doc(loggedInUser.uid)
            .valueChanges()
            .pipe(take(1));

        const loggedInUserFromDB: User | unknown =
            await firstValueFrom(loggedInUserFromDB$);

        const postsRef = this.db.collection<Post>('posts', (ref) =>
            ref
                .where('creatorId', 'in', [
                    loggedInUser.uid,
                    ...(loggedInUserFromDB as User).followingUsers,
                ])
                .orderBy('createdAt', 'desc'),
        );

        return postsRef.valueChanges().pipe(
            tap(async (posts: Post[]) => {
                this._posts$.next([...posts]);
            }),
        );
    }

    async toggleLike(isLikeClicked: boolean, post: Post) {
        if (isLikeClicked) return await this.addLike(post);
        else return await this.removeLike(post);
    }

    async addLike(post: Post) {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const loggedInUser = this.authService.getLoggedInUser();

                post.likedByUsers = post.likedByUsers.map(
                    (likedByUser: any) => {
                        return likedByUser._id;
                    },
                );
                post.likedByUsers.push(loggedInUser.uid as unknown as User);

                await this.db
                    .collection('posts')
                    .doc(post._id)
                    .update({
                        likedByUsers: [...post.likedByUsers],
                    });

                resolve('Add like done');
            } catch (err: any) {
                reject('Add like failed:');
                throw err;
            }
        });
    }

    getPostsForUser(userId: string) {
        const postsRef = this.db.collection('posts', (ref) =>
            ref.where('creatorId', '==', userId).orderBy('createdAt', 'desc'),
        );

        return postsRef.valueChanges() as Observable<Post[]>;
    }

    async removeLike(post: Post) {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const loggedInUser = this.authService.getLoggedInUser();
                const loggedInUserId = loggedInUser.uid;

                post.likedByUsers = post.likedByUsers.map(
                    (likedByUser: any) => {
                        return likedByUser._id;
                    },
                );

                const likedByUserIdx = post.likedByUsers.findIndex(
                    (likedByUser: User | string) =>
                        likedByUser === loggedInUserId,
                );

                post.likedByUsers.splice(likedByUserIdx, 1);

                await this.db
                    .collection('posts')
                    .doc(post._id)
                    .update({
                        likedByUsers: [...post.likedByUsers],
                    });

                resolve('Remove like done');
            } catch (err: any) {
                resolve('Remove like failed!');
                throw err;
            }
        });
    }

    async uploadMedia() {
        try {
            const { image, orientation } =
                await this.imageCompress.uploadFile();

            const compressedImage = await this.imageCompress.compressFile(
                image,
                orientation,
                50,
                50,
            );

            return compressedImage;
        } catch (err: any) {
            console.error(err);
            return null;
        }
    }

    async createPost(post: Post) {
        const loggedInUser = this.authService.getLoggedInUser();
        post.creatorId = loggedInUser.uid;
        const loggedInUserFromDB$ = this.db
            .collection('users')
            .doc(loggedInUser.uid)
            .valueChanges()
            .pipe(take(1));
        const loggedInUserFromDB = (await firstValueFrom(
            loggedInUserFromDB$,
        )) as User;

        post.creatorFullName =
            (loggedInUser.displayName as string) || loggedInUserFromDB.fullName;
        post.createdAt = Date.now();

        const docData = await this.db.collection('posts').add(post);
        await this.db
            .collection('posts')
            .doc(docData.id)
            .update({ _id: docData.id });
    }

    getCommentsByPostId(postId: string) {
        const commentsRef = this.db.collection('comments', (ref) =>
            ref
                .where('postId', '==', postId)
                .where('isTopLevel', '==', true)
                .orderBy('createdAt', 'desc'),
        );

        return commentsRef.valueChanges() as Observable<Comment[]>;
    }

    getRepliesForComment(comment: Comment) {
        if (!comment.replies?.length) comment.replies = [''];

        const repliesRef = this.db.collection('comments', (ref) =>
            ref
                .where('isTopLevel', '==', false)
                .where('_id', 'in', comment.replies)
                .orderBy('createdAt', 'desc'),
        );

        return repliesRef.valueChanges() as Observable<Comment[]>;
    }

    async addComment(comment: Comment, post: Post) {
        comment.createdAt = Date.now();
        comment.isTopLevel = true;

        const commentRef = await this.db.collection('comments').add(comment);
        await this.db
            .collection('comments')
            .doc(commentRef.id)
            .update({ _id: commentRef.id, parentId: commentRef.id });
    }

    async addReply(reply: Comment) {
        reply.createdAt = Date.now();
        reply.createdByUserId = reply.createdByUserId._id;
        reply.isTopLevel = false;

        // Update the parent comment with a new reply
        const parentComment$ = this.db
            .collection('comments')
            .doc(reply.parentId)
            .valueChanges()
            .pipe(take(1));
        const parentComment = (await firstValueFrom(parentComment$)) as Comment;

        if (!parentComment.replies) {
            parentComment.replies = [];
        }

        const replyRef = await this.db.collection('comments').add(reply);
        await this.db
            .collection('comments')
            .doc(replyRef.id)
            .update({ _id: replyRef.id });

        await this.db
            .collection('comments')
            .doc(reply.parentId)
            .update({
                replies: [...(parentComment.replies as string[]), replyRef.id],
            });
    }

    getCommentById(commentId: string) {
        return this.db
            .collection('comments')
            .doc(commentId)
            .valueChanges() as Observable<Comment>;
    }

    private _makeId(length = 5) {
        let text = '';
        let possible =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(
                Math.floor(Math.random() * possible.length),
            );
        }
        return text;
    }

    private _handleError(err: HttpErrorResponse) {
        console.log('err:', err);
        return throwError(() => err);
    }
}
