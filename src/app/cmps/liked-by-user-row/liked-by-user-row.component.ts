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
        post: Post;
        user: User;
        isFollowClicked: boolean;
    }>();
    isFollowClicked: boolean = false;
    isComponentInitialized = false;

    async ngOnInit() {
        const userFromDB$ = this.authService.getUserById(this.user._id);
        const userFromDB = await firstValueFrom(userFromDB$);

        const loggedInUser$ = this.authService.loggedInUser$;
        const loggedInUser = await firstValueFrom(loggedInUser$);

        this.isFollowClicked = !!(userFromDB as User).followedByUsers.find(
            (followedByUser: User | string) =>
                followedByUser === loggedInUser?.user?.uid,
        );

        this.isComponentInitialized = true;
    }

    toggleFollow() {
        this.isFollowClicked = !this.isFollowClicked;
        this.onToggleFollow.emit({
            post: this.post,
            user: this.user,
            isFollowClicked: this.isFollowClicked,
        });
    }
}
