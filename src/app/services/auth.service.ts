import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { BehaviorSubject, take } from 'rxjs';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private afs: AngularFireAuth,
        private db: AngularFirestore,
    ) {}

    private _loggedInUser$ = new BehaviorSubject<UserCredential | null>(
        JSON.parse(sessionStorage.getItem('loggedInUser')!) || null,
    );
    public loggedInUser$ = this._loggedInUser$.asObservable();

    async logInWithGoogle() {
        try {
            const res = await this.afs.signInWithPopup(
                new GoogleAuthProvider(),
            );
            this.createUserOnDB(res);
            sessionStorage.setItem('loggedInUser', JSON.stringify(res));
            this._loggedInUser$.next(res);
            return res;
        } catch (err: any) {
            console.error(err.message);
            throw err.message;
        }
    }

    async logInWithEmailAndPassword(userCred: {
        email: string;
        password: string;
    }) {
        try {
            const res = await this.afs.signInWithEmailAndPassword(
                userCred.email,
                userCred.password,
            );
            this.createUserOnDB(res);
            sessionStorage.setItem('loggedInUser', JSON.stringify(res));
            this._loggedInUser$.next(res);
            return res;
        } catch (err: any) {
            console.error(err.message);
            throw err.message;
        }
    }

    async registerWithEmailAndPassword(userCred: {
        email: string;
        password: string;
    }) {
        try {
            const res = await this.afs.createUserWithEmailAndPassword(
                userCred.email,
                userCred.password,
            );
            this.createUserOnDB(res);
            sessionStorage.setItem('loggedInUser', JSON.stringify(res));
            this._loggedInUser$.next(res);
            return res;
        } catch (err: any) {
            console.error(err.message);
            throw err.message;
        }
    }

    async logOut() {
        try {
            await this.afs.signOut();
            sessionStorage.removeItem('loggedInUser');
            this._loggedInUser$.next(null);
        } catch (err: any) {
            console.error(err.message);
            throw err.message;
        }
    }

    createUserOnDB(res: UserCredential) {
        this.db
            .collection('users')
            .doc(res.user!.uid)
            .get()
            .pipe(take(1))
            .subscribe({
                next: (data) => {
                    if (data.exists) {
                        const userData: any = data.data();
                    } else {
                        this.db
                            .collection('users')
                            .doc(res.user!.uid)
                            .set({ followedByUsers: [] });
                    }
                },
                error: (err: any) => {
                    console.error(err);
                },
            });
    }
}
