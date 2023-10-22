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
    constructor(private authService: AuthService) {}

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
    loggedInUser = this.authService.getLoggedInUser();
    isLikeClicked = false;
    isComponentInitialized = false;
    isImgLoaded = false;

    ngOnInit() {
        this.authService
            .getUserById(this.post.creatorId)
            .pipe(take(1))
            .subscribe({
                next: (creator: any) => {
                    this.creator = creator;
                    const isLikeClicked = this.post.likedByUsers.find(
                        (likedByUser: User) =>
                            likedByUser._id === this.loggedInUser?.user?.uid,
                    );
                    if (isLikeClicked) this.isLikeClicked = true;

                    this.isComponentInitialized = true;
                },
            });
    }

    onImageLoad() {
        this.isImgLoaded = true;
    }

    toggleLike() {
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
