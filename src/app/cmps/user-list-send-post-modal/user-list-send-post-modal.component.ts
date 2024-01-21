import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
    selector: 'user-list-send-post-modal',
    templateUrl: './user-list-send-post-modal.component.html',
    styleUrls: ['./user-list-send-post-modal.component.scss'],
})
export class UserListSendPostModalComponent implements OnInit {
    @Input() users!: User[];
    @Output() onChooseUserToSendPost = new EventEmitter();

    ngOnInit() {
        // console.log(this.users);
    }

    trackByUserId(index: number, user: User) {
        return user._id;
    }
}
