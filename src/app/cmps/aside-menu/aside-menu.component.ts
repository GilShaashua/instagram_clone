import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom, Observable, Subscription, take } from 'rxjs';
import firebase from 'firebase/compat';
import { Router } from '@angular/router';
import UserCredential = firebase.auth.UserCredential;
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'aside-menu',
    templateUrl: './aside-menu.component.html',
    styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit, OnDestroy {
    user!: any | null;
    userSubscription!: Subscription;
    isExtraMenuOpen = false;
    isSearchModalShown = false;
    users$!: Observable<User[]>;
    filterBy = { account: '' };

    constructor(
        private authService: AuthService,
        private router: Router,
        private userService: UserService,
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

        this.userService.isSearchModalShown$.subscribe({
            next: (value) => {
                this.isSearchModalShown = value;
            },
        });
    }

    async getUsers() {
        this.users$ = (await this.userService.getUsers(
            this.filterBy,
        )) as Observable<User[]>;
    }

    onToggleSearchModal(value: boolean) {
        this.userService.setIsSearchModalShown(value);
    }

    async onToggleFollow({
        isFollowClicked,
        user,
    }: {
        isFollowClicked: boolean;
        user: User;
    }) {
        const userFromDB$ = this.authService
            .getUserById(user._id)
            .pipe(take(1));
        const userFromDB = await firstValueFrom(userFromDB$);

        user = userFromDB;
        await this.userService.toggleFollow(isFollowClicked, user);
    }

    onClickSearchModal(elLinks: HTMLElement[]) {
        elLinks.forEach((elLink) => {
            elLink.classList.remove('active');
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
