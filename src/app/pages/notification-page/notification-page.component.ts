import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';
import { Notification } from '../../models/notification.model';

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
    ) {}

    notifications!: Notification[];

    async ngOnInit() {
        this.notificationService
            .getNotificationsForUser(
                this.authService.getLoggedInUser()!.user!.uid,
            )
            .pipe(take(1))
            .subscribe({
                next: (notifications) => {
                    this.notifications = notifications;
                    console.log(' this.notifications', this.notifications);
                },
            });
    }
}
