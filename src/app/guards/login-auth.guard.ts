import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;

export const loginAuthGuard = () => {
    let loggedInUser: UserCredential | null =
        inject(AuthService).getLoggedInUser();

    if (loggedInUser) {
        console.error('LoggedInUser exists - no access to login page!');
        inject(Router).navigateByUrl('/');
        return false;
    } else return true;
};
