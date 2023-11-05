import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post.model';

@Component({
    selector: 'more-options-modal',
    templateUrl: './more-options-modal.component.html',
    styleUrls: ['./more-options-modal.component.scss'],
})
export class MoreOptionsModalComponent implements OnInit {
    constructor(private authService: AuthService) {}

    @Input() post!: Post;
    @Input() creator!: User;
    @Output() onToggleFollow = new EventEmitter();

    isFollowClicked = false;
    loggedInUser!: any;
    isMoreOptionsModalInited = false;

    async ngOnInit() {
        const userFromDB$ = this.authService.getUserById(this.creator._id);
        const userFromDB = await firstValueFrom(userFromDB$);

        const loggedInUser = this.authService.getLoggedInUser();
        this.loggedInUser = loggedInUser;

        this.isFollowClicked = !!(userFromDB as User).followedByUsers.find(
            (followedByUser: User | string) =>
                followedByUser === loggedInUser!.user!.uid,
        );

        this.isMoreOptionsModalInited = true;
    }

    toggleFollow() {
        this.isFollowClicked = !this.isFollowClicked;
        this.onToggleFollow.emit({
            post: this.post,
            user: this.creator,
            isFollowClicked: this.isFollowClicked,
        });
    }
}
