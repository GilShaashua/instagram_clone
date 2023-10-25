import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    constructor(private db: AngularFirestore) {}

    async addNotification(notification: Notification, action: string) {
        notification.message = 'liked your post';
        notification.createdAt = Date.now();
        const ref = await this.db.collection('notifications').add(notification);
        await this.db
            .collection('notifications')
            .doc(ref.id)
            .update({ _id: ref.id });
    }

    getNotificationsForUser(userId: string) {
        return this.db
            .collection('notifications', (ref) =>
                ref.where('recipient', '==', userId),
            )
            .valueChanges() as Observable<Notification[]>;
    }

    async markAsRead(notificationId: string) {
        await this.db
            .doc(`notifications/${notificationId}`)
            .update({ read: true });
    }
}
