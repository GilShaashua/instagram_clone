import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'liked-by-user-row',
    templateUrl: './liked-by-user-row.component.html',
    styleUrls: ['./liked-by-user-row.component.scss'],
})
export class LikedByUserRowComponent implements OnInit {
    constructor(private authService: AuthService) {}
    @Input() post!: Post;
    @Input() user!: User;
    @Output() onToggleFollow = new EventEmitter<{
        user: User;
        isFollowClicked: boolean;
    }>();
    @Output() onClickUserImg = new EventEmitter();

    isFollowClicked: boolean = false;
    isComponentInitialized = false;
    loggedInUser!: any;
    isToggleFollowProcessing = false;

    async ngOnInit() {
        console.log('user', this.user);

        const userFromDB$ = this.authService.getUserById(this.user._id);
        const userFromDB = await firstValueFrom(userFromDB$);

        const loggedInUser = this.authService.getLoggedInUser();
        this.loggedInUser = loggedInUser;

        this.isFollowClicked = !!(userFromDB as User).followedByUsers.find(
            (followedByUser: User | string) =>
                followedByUser === loggedInUser.uid,
        );

        this.isComponentInitialized = true;
    }

    toggleFollow() {
        if (this.isToggleFollowProcessing) return;

        this.isToggleFollowProcessing = true;

        this.isFollowClicked = !this.isFollowClicked;

        this.onToggleFollow.emit({
            user: this.user,
            isFollowClicked: this.isFollowClicked,
        });

        this.isToggleFollowProcessing = false;
    }
}
