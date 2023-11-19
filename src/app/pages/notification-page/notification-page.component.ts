import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';
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
export class NotificationPageComponent implements OnInit {
    constructor(
        private notificationService: NotificationService,
        private authService: AuthService,
        private userService: UserService,
    ) {
        this.userService.setIsSearchModalShown(false);
    }

    notifications!: Notification[];

    async ngOnInit() {
        const loggedInUser = this.authService.getLoggedInUser();

        if (loggedInUser) {
            this.notificationService
                .getNotificationsForUser(loggedInUser.uid)
                .pipe(take(1))
                .subscribe({
                    next: (notifications) => {
                        this.notifications = notifications;
                    },
                });
        }
    }
}
