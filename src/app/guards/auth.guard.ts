import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;

export const authGuard = () => {
    let loggedInUser: UserCredential | null = null;

    inject(AuthService)
        .loggedInUser$.pipe(take(1))
        .subscribe({
            next: (_loggedInUser) => {
                loggedInUser = _loggedInUser;
            },
        });
    if (loggedInUser) return true;
    else {
        inject(Router).navigateByUrl('/login');
        return false;
    }
};
