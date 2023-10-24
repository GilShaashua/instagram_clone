import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'post-header',
    templateUrl: './post-header.component.html',
    styleUrls: ['./post-header.component.scss'],
})
export class PostHeaderComponent implements OnInit {
    constructor(private authService: AuthService) {}
    @Input() creator!: User;
    @Input() post!: Post;
    @Input() isComponentInitialized!: boolean;
    @Output() onToggleFollow = new EventEmitter();

    isMoreOptionsModalShown = false;
    isFollowClicked = false;
    loggedInUser!: any;

    async ngOnInit() {
        const userFromDB$ = this.authService.getUserById(this.creator._id);
        const userFromDB = await firstValueFrom(userFromDB$);

        const loggedInUser = this.authService.getLoggedInUser();
        this.loggedInUser = loggedInUser;

        this.isFollowClicked = !!(userFromDB as User).followedByUsers.find(
            (followedByUser: User | string) =>
                followedByUser === loggedInUser!.user!.uid,
        );
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
