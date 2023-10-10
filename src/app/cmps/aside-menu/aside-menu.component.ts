import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription, take } from 'rxjs';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;
import { Router } from '@angular/router';

@Component({
    selector: 'aside-menu',
    templateUrl: './aside-menu.component.html',
    styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit, OnDestroy {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    user!: UserCredential | null;
    userSubscription!: Subscription;
    isExtraMenuOpen = false;

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
        this.userSubscription.unsubscribe();
    }
}
