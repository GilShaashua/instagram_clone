import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    host: {
        class: 'page-cmp-layout',
    },
})
export class ProfileComponent {
    constructor(private userService: UserService) {
        this.userService.setIsSearchModalShown(false);
    }
}
