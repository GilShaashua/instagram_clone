import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom, Subscription, take } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'aside-menu',
    templateUrl: './aside-menu.component.html',
    styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit, OnDestroy {
    user!: User;
    userSubscription!: Subscription;
    isExtraMenuOpen = false;
    isSearchModalShown = false;
    users!: User[];
    filterBy = { account: '' };
    usersSubscription!: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router,
        private userService: UserService,
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
                    this.user = loggedInUserFromDB;
                } else {
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

    getUsers() {
        this.usersSubscription?.unsubscribe();
        this.usersSubscription = this.userService
            .getUsers(this.filterBy)
            .subscribe({
                next: (users) => {
                    this.users = users;
                },
            });
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
        this.usersSubscription?.unsubscribe();
    }
}
