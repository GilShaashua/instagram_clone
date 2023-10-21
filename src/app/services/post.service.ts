import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    combineLatest,
    finalize,
    firstValueFrom,
    map,
    retry,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { Post } from '../models/post.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import firebase from 'firebase/compat';
import { User } from '../models/user.model';
import cloneDeep from 'lodash-es/cloneDeep';
import {
    Storage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from '@angular/fire/storage';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
    providedIn: 'root',
})
export class PostService {
    constructor(
        private db: AngularFirestore,
        private authService: AuthService,
        private storage: Storage,
    ) {}

    private _posts$ = new BehaviorSubject<Post[]>([]);
    public posts$ = this._posts$.asObservable();

    getPosts() {
        const postsRef = this.db.collection<Post>('posts');

        return postsRef.valueChanges().pipe(
            take(1),
            switchMap((posts: any[]) => {
                let userIds = posts.reduce((acc, post) => {
                    return acc.concat(post.likedByUsers || []);
                }, []);
                const uniqueUserIds = Array.from(new Set(userIds));

                if (!uniqueUserIds.length) {
                    return [posts];
                }

                return combineLatest(
                    uniqueUserIds.map((userId: any) => {
                        return this.authService.getUserById(userId);
                    }),
                ).pipe(
                    map((userObjects: any[]) => {
                        return posts.map((post) => {
                            if (!post.likedByUsers) {
                                post.likedByUsers = [];
                            } else {
                                post.likedByUsers = post.likedByUsers.map(
                                    (userId: string) =>
                                        userObjects.find(
                                            (user) => user._id === userId,
                                        ),
                                );
                            }
                            return post;
                        });
                    }),
                    retry(1),
                    catchError(this._handleError),
                );
            }),
            tap(async (posts: Post[]) => {
                const loggedInUser = this.authService.getLoggedInUser();

                if (!loggedInUser) return;

                const loggedInUserFromDB$ = this.db
                    .collection('users')
                    .doc(loggedInUser?.user?.uid)
                    .valueChanges();
                const loggedInUserFromDB: User | unknown =
                    await firstValueFrom(loggedInUserFromDB$);

                const filteredPostsByFollowingUsers = posts.filter((post) => {
                    return (loggedInUserFromDB as User).followingUsers.find(
                        (followingUser: string | User) =>
                            followingUser === (post as Post).creatorId,
                    );
                });

                this._posts$.next([...filteredPostsByFollowingUsers]);
            }),
        );
    }

    async toggleLike(isLikeClicked: boolean, post: Post) {
        if (isLikeClicked) await this.addLike(post);
        else await this.removeLike(post);
    }

    async addLike(post: Post) {
        const deepCopyOfPost = cloneDeep(post);
        const loggedInUser = this.authService.getLoggedInUser();
        const loggedInUserId = loggedInUser!.user!.uid;
        this.db
            .collection('users')
            .doc(loggedInUserId)
            .valueChanges()
            .pipe(take(1))
            .subscribe({
                next: async (_loggedInUser: User | unknown) => {
                    const loggedInUser = _loggedInUser as User;
                    const likedByUsersFront =
                        deepCopyOfPost.likedByUsers.slice();
                    likedByUsersFront.push(loggedInUser);
                    deepCopyOfPost.likedByUsers =
                        deepCopyOfPost.likedByUsers.map((likedByUser: any) => {
                            return likedByUser._id;
                        });
                    deepCopyOfPost.likedByUsers.push(
                        loggedInUserId as unknown as User,
                    );
                    await this.db
                        .collection('posts')
                        .doc(post._id)
                        .update({
                            likedByUsers: [...deepCopyOfPost.likedByUsers],
                        });
                    const posts = this._posts$.value;
                    const postToEditIdx = posts.findIndex(
                        (_post) => _post._id === post._id,
                    );
                    const postToFront = {
                        ...deepCopyOfPost,
                        likedByUsers: [...likedByUsersFront] as User[],
                    };
                    posts.splice(postToEditIdx, 1, postToFront);
                    this._posts$.next([...posts]);
                },
            });
    }

    async removeLike(post: Post) {
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
    }

    async uploadMedia(media: any) {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const storageRef = ref(
                    this.storage,
                    `postsMedia/${media.name}`,
                );
                const uploadMedia = uploadBytesResumable(storageRef, media);

                uploadMedia.on(
                    'state_changed',
                    (snapshot) => {
                        const progress =
                            snapshot.bytesTransferred / snapshot.totalBytes;
                        console.log(`Upload media is ${progress * 100}% done`);
                    },
                    (error) => {
                        console.error(error);
                        reject(error); // Reject the promise on error
                    },
                    async () => {
                        const mediaUrl = await getDownloadURL(
                            uploadMedia.snapshot.ref,
                        );
                        resolve(mediaUrl); // Resolve the promise with the media URL
                    },
                );
            } catch (error) {
                reject(error); // Reject the promise in case of any other errors
                throw error;
            }
        });
    }

    async createPost(post: Post) {
        const loggedInUser = this.authService.getLoggedInUser();
        post.creatorId = loggedInUser!.user!.uid;
        post.creatorFullName = loggedInUser!.user!.displayName as string;
        post.createdAt = Date.now();

        const docData = await this.db.collection('posts').add(post);
        console.log('docData', docData);
        await this.db
            .collection('posts')
            .doc(docData.id)
            .update({ _id: docData.id });
    }

    private _handleError(err: HttpErrorResponse) {
        console.log('err:', err);
        return throwError(() => err);
    }
}
