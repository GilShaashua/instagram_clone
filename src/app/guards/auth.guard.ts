import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import firebase from 'firebase/compat';

export const authGuard = () => {
    const loggedInUser: firebase.User | null =
        inject(AuthService).getLoggedInUser();

    if (loggedInUser) {
        // console.log('loggedInUser', loggedInUser);
        return true;
    } else {
        console.error('LoggedInUser doesnt exists - no access to that page!');
        inject(Router).navigateByUrl('/login');
        return false;
    }
};
