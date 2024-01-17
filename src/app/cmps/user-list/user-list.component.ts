import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
    @Input() users!: User[];
    @Output() onAddNewChat = new EventEmitter();

    trackByUserId(index: number, user: User) {
        return user._id;
    }

    addNewChat(userId: string) {
        this.onAddNewChat.emit(userId);
    }
}
