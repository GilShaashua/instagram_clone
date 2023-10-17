import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { BehaviorSubject, take } from 'rxjs';
import firebase from 'firebase/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _loggedInUser$ = new BehaviorSubject<UserCredential | null>(
        JSON.parse(sessionStorage.getItem('loggedInUser')!) || null,
    );
    public loggedInUser$ = this._loggedInUser$.asObservable();

    constructor(
        private afAuth: AngularFireAuth,
        private db: AngularFirestore,
    ) {}

    getLoggedInUser() {
        return this._loggedInUser$.value;
    }
    async logInWithGoogle() {
        try {
            const auth = await this.afAuth.signInWithPopup(
                new GoogleAuthProvider(),
            );
            await this.createOrUpdateUserOnDB(auth);
            sessionStorage.setItem('loggedInUser', JSON.stringify(auth));
            this._loggedInUser$.next(auth);
            return auth;
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
            await this.createOrUpdateUserOnDB(auth, userCred);
            sessionStorage.setItem('loggedInUser', JSON.stringify(auth));
            this._loggedInUser$.next(auth);
            return auth;
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
            await this.createOrUpdateUserOnDB(auth, userCred);
            sessionStorage.setItem('loggedInUser', JSON.stringify(auth));
            this._loggedInUser$.next(auth);
            return auth;
        } catch (err: any) {
            console.error(err.message);
            throw err.message;
        }
    }

    async logOut() {
        try {
            await this.afAuth.signOut();
            sessionStorage.removeItem('loggedInUser');
            this._loggedInUser$.next(null);
        } catch (err: any) {
            console.error(err.message);
            throw err.message;
        }
    }

    async createOrUpdateUserOnDB(
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
                                        // @ts-ignore
                                        auth.additionalUserInfo?.profile?.name,
                                });
                        }
                        if (!userData.imgUrl) {
                            await this.db
                                .collection('users')
                                .doc(auth.user!.uid)
                                .update({
                                    imgUrl:
                                        auth.user!.photoURL ||
                                        'https://res.cloudinary.com/dpbcaizq9/image/upload/v1686066256/user_jsqpzw.png',
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
                                    // @ts-ignore
                                    auth.additionalUserInfo?.profile?.name,
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

    getUserById(userId: string) {
        return this.db.collection('users').doc(userId).valueChanges();
    }
}
