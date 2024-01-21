import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase/compat';
import { User } from '../../models/user.model';

@Component({
    selector: 'menu-mobile',
    templateUrl: './menu-mobile.component.html',
    styleUrls: ['./menu-mobile.component.scss'],
})
export class MenuMobileComponent implements OnInit, OnDestroy {
    loggedInUser!: User;
    userSubscription!: Subscription;
    isExtraMenuOpen = false;

    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.userSubscription = this.authService.loggedInUser$.subscribe({
            next: async (_loggedInUser) => {
                if (_loggedInUser) {
                    const loggedInUserFromDB$ = this.authService.getUserById(
                        _loggedInUser.uid,
                    );
                    const loggedInUserFromDB =
                        await firstValueFrom(loggedInUserFromDB$);
                    this.loggedInUser = loggedInUserFromDB;
                } else {
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
