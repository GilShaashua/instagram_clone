import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
    selector: 'user-row',
    templateUrl: './user-row.component.html',
    styleUrls: ['./user-row.component.scss'],
})
export class UserRowComponent {
    @Input() user!: User;
    @Output() onAddNewChat = new EventEmitter();

    addNewChat() {
        this.onAddNewChat.emit(this.user._id);
    }
}
