import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { BehaviorSubject, Observable, take } from 'rxjs';
import firebase from 'firebase/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private afAuth: AngularFireAuth,
        private db: AngularFirestore,
    ) {}

    private _loggedInUser$ = new BehaviorSubject(
        document.cookie.match(/loggedInUser=(.*)/)
            ? JSON.parse(document.cookie.match(/loggedInUser=(.*)/)![1])
            : null,
    );
    public loggedInUser$ = this._loggedInUser$.asObservable();

    async logInWithGoogle() {
        try {
            const auth = await this.afAuth.signInWithPopup(
                new GoogleAuthProvider(),
            );
            await this._createOrUpdateUserOnDB(auth);

            const loggedInUser = await this.afAuth.currentUser;

            if (loggedInUser) {
                document.cookie = `loggedInUser=${JSON.stringify(
                    loggedInUser,
                )}; max-age=999999999999; path=/`;

                this._loggedInUser$.next(loggedInUser);
            }
        } catch (err: any) {
            console.error(err.message);
            throw err.message;
        }
    }

    async logInWithEmailAndPassword(userCred: {
        fullName: string;
        email: string;
        password: string;
    }) {
        try {
            const auth = await this.afAuth.signInWithEmailAndPassword(
                userCred.email,
                userCred.password,
            );
            await this._createOrUpdateUserOnDB(auth, userCred);

            const loggedInUser = await this.afAuth.currentUser;

            if (loggedInUser) {
                document.cookie = `loggedInUser=${JSON.stringify(
                    loggedInUser,
                )}; max-age=999999999999; path=/`;

                this._loggedInUser$.next(loggedInUser);
            }
        } catch (err: any) {
            console.error(err.message);
            throw err.message;
        }
    }

    async registerWithEmailAndPassword(userCred: {
        fullName: string;
        email: string;
        password: string;
    }) {
        try {
            const auth = await this.afAuth.createUserWithEmailAndPassword(
                userCred.email,
                userCred.password,
            );
            await this._createOrUpdateUserOnDB(auth, userCred);

            const loggedInUser = await this.afAuth.currentUser;

            if (loggedInUser) {
                document.cookie = `loggedInUser=${JSON.stringify(
                    loggedInUser,
                )}; max-age=999999999999; path=/`;

                this._loggedInUser$.next(loggedInUser);
            }
        } catch (err: any) {
            console.error(err.message);
            throw err.message;
        }
    }

    async logOut() {
        try {
            await this.afAuth.signOut();

            document.cookie = `loggedInUser=${JSON.stringify(
                null,
            )}; max-age=0; path=/`;
            this._loggedInUser$.next(null);
        } catch (err: any) {
            console.error(err.message);
            throw err.message;
        }
    }

    getUserById(userId: string) {
        return this.db
            .collection('users')
            .doc(userId)
            .valueChanges() as Observable<User>;
    }

    getLoggedInUser() {
        return this._loggedInUser$.value as firebase.User;
    }

    private async _createOrUpdateUserOnDB(
        auth: UserCredential,
        userCred: {
            fullName: string;
            email: string;
            password: string;
        } | null = null,
    ) {
        this.db
            .collection('users')
            .doc(auth.user!.uid)
            .get()
            .pipe(take(1))
            .subscribe({
                next: async (data) => {
                    if (data.exists) {
                        const userData: any = data.data();

                        if (!userData._id) {
                            await this.db
                                .collection('users')
                                .doc(auth.user!.uid)
                                .update({ _id: auth.user!.uid });
                        }
                        if (!userData.fullName) {
                            await this.db
                                .collection('users')
                                .doc(auth.user!.uid)

                                .update({
                                    fullName:
                                        userCred?.fullName ||
                                        auth.user?.displayName,
                                });
                        }
                        if (!userData.imgUrl) {
                            await this.db
                                .collection('users')
                                .doc(auth.user!.uid)
                                .update({
                                    imgUrl:
                                        auth.user!.photoURL ||
                                        'https://res.cloudinary.com/dpbcaizq9/image/upload/v1706126532/user_hzaeq1.jpg',
                                });
                        }
                        if (!userData.followedByUsers) {
                            await this.db
                                .collection('users')
                                .doc(auth.user!.uid)
                                .update({ followedByUsers: [] });
                        }
                        if (!userData.followingUsers) {
                            await this.db
                                .collection('users')
                                .doc(auth.user!.uid)
                                .update({ followingUsers: [] });
                        }
                    } else {
                        await this.db
                            .collection('users')
                            .doc(auth.user!.uid)
                            .set({
                                _id: auth.user!.uid,
                                fullName:
                                    userCred?.fullName ||
                                    auth.user?.displayName,
                                imgUrl:
                                    auth.user!.photoURL ||
                                    'https://res.cloudinary.com/dpbcaizq9/image/upload/v1686066256/user_jsqpzw.png',
                                followedByUsers: [],
                                followingUsers: [],
                            });
                    }
                },
                error: (err: any) => {
                    console.error(err);
                },
            });
    }
}
