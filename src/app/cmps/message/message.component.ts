import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../../models/message.model';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy {
    constructor(private authService: AuthService) {}

    @Input() message!: Message;
    @Input() participantUser!: User;
    @Input() loggedInUserFromDB!: User;

    ngOnInit() {}

    ngOnDestroy() {}
}
1;
