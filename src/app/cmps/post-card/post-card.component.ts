import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from '../../models/post.model';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';
import { User } from '../../models/user.model';
import cloneDeep from 'lodash-es/cloneDeep';

@Component({
    selector: 'post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit {
    @Input() post!: Post;
    @Output() onToggleLike = new EventEmitter<{
        post: Post;
        isLikeClicked: boolean;
    }>();
    @Output() onToggleFollow = new EventEmitter<{
        post: Post;
        user: User;
        isFollowClicked: boolean;
    }>();
    creator!: User;
    isMoreClicked = false;
    isLikedByUsersModalShown = false;
    loggedInUser: any;
    isLikeClicked = false;
    isToggleLikeProcessing: boolean = false;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.authService
            .getUserById(this.post.creatorId)
            .pipe(take(1))
            .subscribe({
                next: (creator: any) => {
                    this.creator = creator;
                },
            });
        this.authService.loggedInUser$.pipe(take(1)).subscribe({
            next: (loggedInUser) => {
                this.loggedInUser = loggedInUser;
            },
        });
        const isLikeClicked = this.post.likedByUsers.find(
            (likedByUser: User) =>
                likedByUser._id === this.loggedInUser.user.uid,
        );
        if (isLikeClicked) this.isLikeClicked = true;
    }

    toggleLike() {
        if (this.isToggleLikeProcessing) return;

        this.isToggleLikeProcessing = true;

        setTimeout(() => {
            this.isToggleLikeProcessing = false;
        }, 2000);

        this.isLikeClicked = !this.isLikeClicked;

        this.onToggleLike.emit({
            post: cloneDeep(this.post),
            isLikeClicked: this.isLikeClicked,
        });
    }

    toggleLikedByUsersModal(isLikedByUsersModalShown: boolean) {
        this.isLikedByUsersModalShown = isLikedByUsersModalShown;
    }
}
