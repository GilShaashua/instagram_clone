import { Component, Input } from '@angular/core';
import { Notification } from '../../models/notification.model';

@Component({
    selector: 'notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.scss'],
})
export class NotificationListComponent {
    @Input() notifications!: Notification[];

    trackByNotificationId(index: number, notification: Notification) {
        return notification.id;
    }
}
