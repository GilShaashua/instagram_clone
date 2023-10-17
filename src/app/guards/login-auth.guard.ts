import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

export const loginAuthGuard = () => {
    let user = null;
    inject(AuthService)
        .loggedInUser$.pipe(take(1))
        .subscribe({
            next: (loggedInUser) => {
                user = loggedInUser;
            },
        });

    if (user) {
        console.error('LoggedInUser exists - no access to login page!');
        inject(Router).navigateByUrl('/');
        return false;
    } else return true;
};
