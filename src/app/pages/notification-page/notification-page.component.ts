import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { Subscription, take } from 'rxjs';
import { Notification } from '../../models/notification.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'notification-page',
    templateUrl: './notification-page.component.html',
    styleUrls: ['./notification-page.component.scss'],
    host: {
        class: 'page-cmp-layout',
    },
})
export class NotificationPageComponent implements OnInit, OnDestroy {
    constructor(
        private notificationService: NotificationService,
        private authService: AuthService,
        private userService: UserService,
    ) {
        this.userService.setIsSearchModalShown(false);
    }

    notifications!: Notification[];
    notificationsSubscription!: Subscription;

    async ngOnInit() {
        const loggedInUser = this.authService.getLoggedInUser();

        this.notificationService
            .getNotificationsForUser(loggedInUser.uid)
            .subscribe({
                next: (notifications) => {
                    this.notifications = notifications;
                },
            });
    }

    ngOnDestroy() {
        this.notificationsSubscription?.unsubscribe();
    }
}
