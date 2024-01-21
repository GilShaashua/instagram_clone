import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
    selector: 'user-row-send-post-modal',
    templateUrl: './user-row-send-post-modal.component.html',
    styleUrls: ['./user-row-send-post-modal.component.scss'],
})
export class UserRowSendPostModalComponent {
    @Input() user!: User;
    @Output() onChooseUserToSendPost = new EventEmitter();
}
