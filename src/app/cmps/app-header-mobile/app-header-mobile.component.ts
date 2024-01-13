import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { firstValueFrom, Observable, Subscription, take } from 'rxjs';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header-mobile',
    templateUrl: './app-header-mobile.component.html',
    styleUrls: ['./app-header-mobile.component.scss'],
})
export class AppHeaderMobileComponent implements OnInit, OnDestroy {
    constructor(
        private router: Router,
        private userService: UserService,
        private authService: AuthService,
    ) {}

    filterBy = { account: '' };
    isSearchModalShown!: boolean;
    searchModalSubscription!: Subscription;
    users!: User[];
    usersSubscription!: Subscription;

    ngOnInit() {
        this.searchModalSubscription =
            this.userService.isSearchModalShown$.subscribe({
                next: (value) => {
                    this.isSearchModalShown = value;
                    this.filterBy.account = '';
                },
            });
    }

    onClickLogo() {
        this.router.navigateByUrl('/');
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

    ngOnDestroy() {
        this.searchModalSubscription?.unsubscribe();
        this.usersSubscription?.unsubscribe();
    }
}
