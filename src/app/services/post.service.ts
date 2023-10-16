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
    throwError,
} from 'rxjs';
import { Post } from '../models/post.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import firebase from 'firebase/compat';
import { User } from '../models/user.model';
import cloneDeep from 'lodash-es/cloneDeep';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
    providedIn: 'root',
})
export class PostService {
    private _posts$ = new BehaviorSubject<Post[]>([]);
    public posts$ = this._posts$.asObservable();

    constructor(
        private db: AngularFirestore,
        private authService: AuthService,
    ) {}

    getPosts() {
        return this.db
            .collection('posts')
            .valueChanges()
            .pipe(
                switchMap((posts: any[]) => {
                    let userIds = posts.reduce((acc, post) => {
                        return acc.concat(post.likedByUsers || []);
                    }, []);
                    const uniqueUserIds = Array.from(new Set(userIds));

                    // Fetch user data for each unique user ID and cast to the expected User type.
                    return combineLatest(
                        uniqueUserIds.map((userId: any) => {
                            return this.authService.getUserById(userId);
                        }),
                    ).pipe(
                        map((userObjects: any[]) => {
                            return posts.map((post) => {
                                // Check if likedByUsers is empty, and act accordingly
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
                        finalize(async () => {
                            console.log('posts before filter', posts);
                            // this.authService.loggedInUser$.pipe(take(1)).subscribe({
                            //     next:(loggedInUser)=>{
                            //         const filteredPostsByFollowingUsers = posts.filter(
                            //                 (post) => {
                            //
                            //                 },
                            //         );
                            //
                            //         this._posts$.next([...posts]);
                            //     }
                            // })

                            const loggedInUser$ =
                                this.authService.loggedInUser$;
                            const loggedInUser =
                                await firstValueFrom(loggedInUser$);
                            const loggedInUserFromDB$ = this.db
                                .collection('users')
                                .doc(loggedInUser?.user?.uid)
                                .valueChanges();
                            const loggedInUserFromDB: User | unknown =
                                await firstValueFrom(loggedInUserFromDB$);

                            const filteredPostsByFollowingUsers = posts.filter(
                                (post) => {
                                    return (
                                        loggedInUserFromDB as User
                                    ).followingUsers.find(
                                        (followingUser: string | User) =>
                                            followingUser ===
                                            (post as Post).creatorId,
                                    );
                                },
                            );
                            console.log(
                                'filteredPostsByFollowingUsers',
                                filteredPostsByFollowingUsers,
                            );

                            this._posts$.next([
                                ...filteredPostsByFollowingUsers,
                            ]);
                        }),
                        retry(1),
                        catchError(this._handleError),
                    );
                }),
            );
    }

    async toggleLike(isLikeClicked: boolean, post: Post) {
        if (isLikeClicked) await this.addLike(post);
        else await this.removeLike(post);
    }

    async addLike(post: Post) {
        const deepCopyOfPost = cloneDeep(post);
        this.authService.loggedInUser$.pipe(take(1)).subscribe({
            next: (loggedInUser: UserCredential | null) => {
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
                                deepCopyOfPost.likedByUsers.map(
                                    (likedByUser: any) => {
                                        return likedByUser._id;
                                    },
                                );
                            deepCopyOfPost.likedByUsers.push(
                                loggedInUserId as unknown as User,
                            );
                            await this.db
                                .collection('posts')
                                .doc(post._id)
                                .update({
                                    likedByUsers: [
                                        ...deepCopyOfPost.likedByUsers,
                                    ],
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
            },
        });
    }

    async removeLike(post: Post) {
        // TODO: fix bug when removing like,
        // TODO: the key "likedByUsers" in db converted to array of user objects
        //  instead of array of strings ids.
        // TODO: its happening after clicking remove like btn

        const deepCopyOfPost = cloneDeep(post);

        this.authService.loggedInUser$.pipe(take(1)).subscribe({
            next: async (loggedInUser: UserCredential | null) => {
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
            },
        });
    }

    private _handleError(err: HttpErrorResponse) {
        console.log('err:', err);
        return throwError(() => err);
    }
}
