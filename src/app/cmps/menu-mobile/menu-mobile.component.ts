import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase/compat';

@Component({
    selector: 'menu-mobile',
    templateUrl: './menu-mobile.component.html',
    styleUrls: ['./menu-mobile.component.scss'],
})
export class MenuMobileComponent implements OnInit, OnDestroy {
    loggedInUser!: firebase.User | null;
    userSubscription!: Subscription;
    isExtraMenuOpen = false;

    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.userSubscription = this.authService.loggedInUser$.subscribe({
            next: (_loggedInUser) => {
                if (_loggedInUser) this.loggedInUser = _loggedInUser;
                else {
                    this.loggedInUser = _loggedInUser;
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
