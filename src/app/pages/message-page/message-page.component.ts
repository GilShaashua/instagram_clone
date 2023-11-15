import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'message-page',
    templateUrl: './message-page.component.html',
    styleUrls: ['./message-page.component.scss'],
    host: {
        class: 'page-cmp-layout',
    },
})
export class MessagePageComponent {
    constructor(private userService: UserService) {
        this.userService.setIsSearchModalShown(false);
    }
}
