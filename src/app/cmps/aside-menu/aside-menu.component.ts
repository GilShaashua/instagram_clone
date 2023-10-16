import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import firebase from 'firebase/compat';
import { Router } from '@angular/router';
import UserCredential = firebase.auth.UserCredential;

@Component({
    selector: 'aside-menu',
    templateUrl: './aside-menu.component.html',
    styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit, OnDestroy {
    user!: UserCredential | null;
    userSubscription!: Subscription;
    isExtraMenuOpen = false;

    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.userSubscription = this.authService.loggedInUser$.subscribe({
            next: (loggedInUser) => {
                if (loggedInUser) this.user = loggedInUser;
                else {
                    this.user = loggedInUser;
                    this.router.navigateByUrl('login');
                }
            },
        });
    }

    async onLogOut() {
        try {
            await this.authService.logOut();
        } catch (err: any) {
            console.error(err.message);
        }
    }

    ngOnDestroy() {
        this.userSubscription?.unsubscribe();
    }
}
