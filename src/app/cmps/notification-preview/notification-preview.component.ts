import { Component, Input, OnInit } from '@angular/core';
import { Notification } from '../../models/notification.model';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
    selector: 'notification-preview',
    templateUrl: './notification-preview.component.html',
    styleUrls: ['./notification-preview.component.scss'],
})
export class NotificationPreviewComponent implements OnInit {
    constructor(private authService: AuthService) {}

    @Input() notification!: Notification;

    sender!: User;

    ngOnInit() {
        this.authService
            .getUserById(this.notification.sender)
            .pipe(take(1))
            .subscribe({
                next: (user: User) => {
                    this.sender = user;
                    console.log(this.sender);
                },
            });
    }
}
