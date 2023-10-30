import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from '../../models/post.model';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom, switchMap, take } from 'rxjs';
import { User } from '../../models/user.model';
import cloneDeep from 'lodash-es/cloneDeep';
import { PostService } from '../../services/post.service';

@Component({
    selector: 'post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private postService: PostService,
    ) {}

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
    @Output() onAddNotification = new EventEmitter<Post>();
    @Output() onAddComment = new EventEmitter();

    creator!: User;
    isMoreClicked = false;
    isLikedByUsersModalShown = false;
    loggedInUser = this.authService.getLoggedInUser();
    isLikeClicked = false;
    isComponentInitialized = false;
    isCommentModalShown = false;
    commentsLength = 0;

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
                },
            });

        this.postService
            .getCommentsByPostId(this.post._id)
            .pipe(
                take(1),
                switchMap(async (comments) => {
                    const getUserPromises = comments.map(async (comment) => {
                        const createdByUser$ = this.authService.getUserById(
                            comment.createdByUserId as string,
                        );
                        const createdByUser =
                            await firstValueFrom(createdByUser$);

                        comment.createdByUserId = createdByUser;

                        return comment;
                    });

                    return await Promise.all(getUserPromises);
                }),
            )
            .subscribe({
                next: (comments) => {
                    this.commentsLength = comments.length;
                    this.isComponentInitialized = true;
                },
            });
    }

    toggleLike() {
        this.isLikeClicked = !this.isLikeClicked;

        this.onToggleLike.emit({
            post: cloneDeep(this.post),
            isLikeClicked: this.isLikeClicked,
        });

        this.isLikeClicked && this.onAddNotification.emit(this.post);
    }

    toggleLikedByUsersModal(isLikedByUsersModalShown: boolean) {
        this.isLikedByUsersModalShown = isLikedByUsersModalShown;
    }

    onToggleCommentModal() {
        this.isCommentModalShown = !this.isCommentModalShown;
        document.body.classList.toggle('body-unscrollable');
    }
}
