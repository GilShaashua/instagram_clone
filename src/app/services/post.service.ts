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
import cloneDeep from 'lodash-es/cloneDeep';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Comment } from '../models/comment.model.';

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
            .doc(loggedInUser?.user?.uid)
            .valueChanges()
            .pipe(take(1));

        const loggedInUserFromDB: User | unknown =
            await firstValueFrom(loggedInUserFromDB$);

        const postsRef = this.db.collection<Post>('posts', (ref) =>
            ref
                .where('creatorId', 'in', [
                    loggedInUser!.user!.uid,
                    ...(loggedInUserFromDB as User).followingUsers,
                ])
                .orderBy('createdAt', 'desc'),
        );

        return postsRef.valueChanges().pipe(
            take(1),
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
                post.likedByUsers.push(
                    loggedInUser!.user!.uid as unknown as User,
                );

                await this.db
                    .collection('posts')
                    .doc(post._id)
                    .update({
                        likedByUsers: [...post.likedByUsers],
                    });

                const posts = this._posts$.value;
                const postToEditIdx = posts.findIndex(
                    (_post) => _post._id === post._id,
                );

                posts.splice(postToEditIdx, 1, post);
                this._posts$.next([...posts]);

                resolve('Add like done');
            } catch (err: any) {
                reject('Add like failed:');
                throw err;
            }
        });
    }

    async removeLike(post: Post) {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const deepCopyOfPost = cloneDeep(post);
                const loggedInUser = this.authService.getLoggedInUser();
                const loggedInUserId = loggedInUser!.user!.uid;
                const likedByUserIdx = deepCopyOfPost.likedByUsers.findIndex(
                    (likedByUser) => likedByUser._id === loggedInUserId,
                );

                deepCopyOfPost.likedByUsers.splice(likedByUserIdx, 1);
                deepCopyOfPost.likedByUsers = deepCopyOfPost.likedByUsers.map(
                    (likedByUser) => likedByUser._id,
                ) as unknown as User[];
                await this.db
                    .collection('posts')
                    .doc(deepCopyOfPost._id)
                    .update({
                        likedByUsers: [...deepCopyOfPost.likedByUsers],
                    });
                const posts = this._posts$.value;
                const postToEditIdx = posts.findIndex(
                    (_post) => _post._id === post._id,
                );

                post.likedByUsers.splice(likedByUserIdx, 1);

                const postToFront = {
                    ...post,
                    likedByUsers: [...post.likedByUsers],
                };
                posts.splice(postToEditIdx, 1, postToFront as unknown as Post);
                this._posts$.next([...posts]);
                resolve('Remove like done');
            } catch (err: any) {
                resolve('Remove like failed!');
                throw err;
            }
        });
    }

    async uploadMedia() {
        // return new Promise<string>(async (resolve, reject) => {
        //     try {
        //         const randId = this._makeId();
        //         const storageRef = ref(
        //             this.storage,
        //             `postsMedia/${media.name}${randId}`,
        //         );
        //         const uploadMedia = uploadBytesResumable(storageRef, media);
        //
        //         uploadMedia.on(
        //             'state_changed',
        //             (snapshot) => {
        //                 const progress =
        //                     snapshot.bytesTransferred / snapshot.totalBytes;
        //                 console.log(`Upload media is ${progress * 100}% done`);
        //             },
        //             (error) => {
        //                 console.error(error);
        //                 reject(error);
        //             },
        //             async () => {
        //                 const mediaUrl = await getDownloadURL(
        //                     uploadMedia.snapshot.ref,
        //                 );
        //
        //                 resolve(mediaUrl);
        //             },
        //         );
        //     } catch (error) {
        //         reject(error);
        //         throw error;
        //     }
        // });

        try {
            const { image, orientation } =
                await this.imageCompress.uploadFile();
            console.log('orientation', orientation);
            console.log(
                'Size in bytes of the uploaded image was:',
                this.imageCompress.byteCount(image),
            );

            const compressedImage = await this.imageCompress.compressFile(
                image,
                orientation,
                50,
                50,
            );

            console.log(
                'Size in bytes after compression is now:',
                this.imageCompress.byteCount(compressedImage),
            );

            return compressedImage;
        } catch (err: any) {
            console.error(err);
            return null;
        }
    }

    async createPost(post: Post) {
        const loggedInUser = this.authService.getLoggedInUser();
        post.creatorId = loggedInUser!.user!.uid;
        const loggedInUserFromDB$ = this.db
            .collection('users')
            .doc(loggedInUser!.user!.uid)
            .valueChanges()
            .pipe(take(1));
        const loggedInUserFromDB = (await firstValueFrom(
            loggedInUserFromDB$,
        )) as User;

        post.creatorFullName =
            (loggedInUser!.user!.displayName as string) ||
            loggedInUserFromDB.fullName;
        post.createdAt = Date.now();

        const docData = await this.db.collection('posts').add(post);
        await this.db
            .collection('posts')
            .doc(docData.id)
            .update({ _id: docData.id });
    }

    getCommentsByPostId(postId: string) {
        const postsRef = this.db.collection('comments', (ref) =>
            ref.where('postId', '==', postId).orderBy('createdAt', 'desc'),
        );
        return postsRef.valueChanges() as Observable<Comment[]>;
    }

    async addComment(comment: Comment, post: Post) {
        comment.createdAt = Date.now();

        const commentRef = await this.db.collection('comments').add(comment);
        await this.db
            .collection('comments')
            .doc(commentRef.id)
            .update({ _id: commentRef.id, parentId: commentRef.id });
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
