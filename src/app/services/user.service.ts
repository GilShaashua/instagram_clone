import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, lastValueFrom, map, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';
import firebase from 'firebase/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(
        private authService: AuthService,
        private db: AngularFirestore,
        private imageCompress: NgxImageCompressService,
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
            next: async (loggedInUser: firebase.User | null) => {
                await this.db
                    .collection('users')
                    .doc(user._id)
                    .update({
                        followedByUsers: [
                            ...user.followedByUsers,
                            loggedInUser?.uid,
                        ],
                    });
            },
        });

        const loggedInUser$ = this.authService.loggedInUser$.pipe(take(1));
        const loggedInUser = await lastValueFrom(loggedInUser$);
        const loggedInUserFromDB$ = this.db
            .collection('users')
            .doc(loggedInUser.uid)
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
            .doc(loggedInUser.uid)
            .valueChanges()
            .pipe(take(1));
        const loggedInUserFromDB = await lastValueFrom(loggedInUserFromDB$);
        const followedByUsersDeepCopy = structuredClone(user.followedByUsers);
        const followedByUserIdx = followedByUsersDeepCopy.findIndex(
            (followedByUser: User | string) =>
                followedByUser === loggedInUser.uid,
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

    getUsers(filterBy: { account: string }) {
        return this.db
            .collection('users')
            .valueChanges()
            .pipe(
                map((users: any) => {
                    const regExp = new RegExp(filterBy.account, 'i');
                    return users.filter((user: any) =>
                        regExp.test(user.fullName),
                    );
                }),
            ) as Observable<User[]>;
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

    updateUserProfile(updatedUser: User) {
        this.db.collection('users').doc(updatedUser._id).set(updatedUser);
    }

    setIsSearchModalShown(value: boolean) {
        this._isSearchModalShown$.next(value);
    }

    getLikedByUsers(likedByUsers: (User | string)[]) {
        likedByUsers = (likedByUsers as User[]).map(
            (likedByUser) => likedByUser._id,
        );

        const usersRef = this.db.collection('users', (ref) => {
            return ref.where('_id', 'in', likedByUsers);
        });

        return usersRef.valueChanges() as Observable<User[]>;
    }
}
