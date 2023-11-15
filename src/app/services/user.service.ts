import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import {
    BehaviorSubject,
    firstValueFrom,
    lastValueFrom,
    Observable,
    of,
    take,
} from 'rxjs';
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

    private _isSearchModalShown$ = new BehaviorSubject(false);
    public isSearchModalShown$ = this._isSearchModalShown$.asObservable();

    async toggleFollow(isFollowClicked: boolean, user: User) {
        if (isFollowClicked) {
            return new Promise<string>(async (resolve) => {
                await this.addFollow(user);
                resolve('Add follow completed successfully!');
            });
        } else {
            return new Promise<string>(async (resolve) => {
                await this.removeFollow(user);
                resolve('Remove follow completed successfully!');
            });
        }
    }

    async addFollow(user: User) {
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

    async removeFollow(user: User) {
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

    async getUsers(filterBy: { account: string }) {
        if (filterBy.account) {
            const users$ = this.db.collection('users').valueChanges();

            let users = await firstValueFrom(users$);

            const regExp = new RegExp(filterBy.account, 'i');
            users = users.filter((user: any) => regExp.test(user.fullName));

            return of(users);
        } else {
            return this.db.collection('users').valueChanges() as Observable<
                User[]
            >;
        }
    }

    setIsSearchModalShown(value: boolean) {
        this._isSearchModalShown$.next(value);
    }
}
