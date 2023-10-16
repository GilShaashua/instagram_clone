import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';
import { lastValueFrom, take } from 'rxjs';
import cloneDeep from 'lodash-es/cloneDeep';
import { AuthService } from './auth.service';
import firebase from 'firebase/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(
        private authService: AuthService,
        private db: AngularFirestore,
    ) {}

    async toggleFollow(isFollowClicked: boolean, user: User, post: Post) {
        if (isFollowClicked) await this.addFollow(user, post);
        else await this.removeFollow(user, post);
    }

    async addFollow(user: User, post: Post) {
        this.authService.loggedInUser$.pipe(take(1)).subscribe({
            next: async (loggedInUser: UserCredential | null) => {
                await this.db
                    .collection('users')
                    .doc(user._id)
                    .update({
                        followedByUsers: [
                            ...user.followedByUsers,
                            loggedInUser?.user?.uid,
                        ],
                    });
            },
        });

        const loggedInUser$ = this.authService.loggedInUser$.pipe(take(1));
        const loggedInUser = await lastValueFrom(loggedInUser$);
        const loggedInUserFromDB$ = this.db
            .collection('users')
            .doc(loggedInUser?.user?.uid)
            .valueChanges()
            .pipe(take(1));
        const loggedInUserFromDB = await lastValueFrom(loggedInUserFromDB$);

        await this.db
            .collection('users')
            .doc((loggedInUserFromDB as User)._id)
            .update({
                followingUsers: [
                    ...(loggedInUserFromDB as User).followingUsers,
                    user._id,
                ],
            });
    }

    async removeFollow(user: User, post: Post) {
        const loggedInUser$ = this.authService.loggedInUser$.pipe(take(1));
        const loggedInUser = await lastValueFrom(loggedInUser$);
        const loggedInUserFromDB$ = this.db
            .collection('users')
            .doc(loggedInUser?.user?.uid)
            .valueChanges()
            .pipe(take(1));
        const loggedInUserFromDB = await lastValueFrom(loggedInUserFromDB$);
        const followedByUsersDeepCopy = cloneDeep(user.followedByUsers);
        const followedByUserIdx = followedByUsersDeepCopy.findIndex(
            (followedByUser: User | string) =>
                followedByUser === loggedInUser?.user?.uid,
        );

        if (followedByUserIdx !== -1)
            followedByUsersDeepCopy.splice(followedByUserIdx, 1);
        else return;

        await this.db
            .collection('users')
            .doc(user._id)
            .update({ followedByUsers: followedByUsersDeepCopy });

        const userToRemoveIdx = (
            loggedInUserFromDB as User
        ).followingUsers.findIndex(
            (followingUser: User | string) => followingUser === user._id,
        );
        (loggedInUserFromDB as User).followingUsers.splice(userToRemoveIdx, 1);

        await this.db
            .collection('users')
            .doc((loggedInUserFromDB as User)._id)
            .update({
                followingUsers: (loggedInUserFromDB as User).followingUsers,
            });
    }
}
