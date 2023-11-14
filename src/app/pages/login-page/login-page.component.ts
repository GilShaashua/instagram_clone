import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { PostService } from '../../services/post.service';

@Component({
    selector: 'login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
    userCred = { fullName: '', email: '', password: '' };
    isLogInFormShown = true;

    constructor(
        private authService: AuthService,
        private postService: PostService,
        private router: Router,
    ) {}

    async onLogInWithGoogle() {
        try {
            const user = await this.authService.logInWithGoogle();
            this.authService.loggedInUser$.pipe(take(1)).subscribe({
                next: (loggedInUser) => {
                    if (loggedInUser) {
                        this.router.navigateByUrl('/');
                    }
                },
                error: (err: any) => {
                    console.error(err);
                },
            });
        } catch (err: any) {
            console.error(err);
        }
    }

    async onLogInWithEmailAndPassword() {
        try {
            await this.authService.logInWithEmailAndPassword(this.userCred);
            this.authService.loggedInUser$.pipe(take(1)).subscribe({
                next: (loggedInUser) => {
                    if (loggedInUser) {
                        this.router.navigateByUrl('/');
                    }
                },
                error: (err: any) => {
                    console.error(err);
                },
            });
        } catch (err: any) {
            console.error(err.message);
        }
    }

    async onRegisterWithEmailAndPassword() {
        try {
            await this.authService.registerWithEmailAndPassword(this.userCred);
            this.authService.loggedInUser$.pipe(take(1)).subscribe({
                next: (loggedInUser) => {
                    if (loggedInUser) {
                        this.router.navigateByUrl('/');
                    }
                },
                error: (err: any) => {
                    console.error(err);
                },
            });
        } catch (err: any) {
            console.error(err.message);
        }
    }
}
