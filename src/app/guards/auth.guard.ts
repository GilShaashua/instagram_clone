import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;

export const authGuard = () => {
    const loggedInUser: UserCredential | null =
        inject(AuthService).getLoggedInUser();

    if (loggedInUser) return true;
    else {
        console.error('LoggedInUser doesnt exists - no access to that page!');
        inject(Router).navigateByUrl('/login');
        return false;
    }
};
