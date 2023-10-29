import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Post } from '../../models/post.model';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom, Subscription, switchMap, take } from 'rxjs';
import { User } from '../../models/user.model';
import cloneDeep from 'lodash-es/cloneDeep';
import { Comment } from '../../models/comment.model.';
import { PostService } from '../../services/post.service';

@Component({
    selector: 'post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit, OnDestroy {
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
    comment: Comment = {
        _id: '',
        parentId: '',
        postId: '',
        createdByUserId: '',
        message: '',
        createdAt: 0,
    };
    comments!: Comment[];
    commentsSubscription!: Subscription;

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

        this.comment.postId = this.post._id;
        this.comment.createdByUserId = this.loggedInUser!.user!.uid;
        this.commentsSubscription = this.postService
            .getCommentsByPostId(this.post._id)
            .pipe(
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
                    this.comments = comments;
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

    addComment() {
        this.onAddComment.emit({ comment: this.comment, post: this.post });
        this.comment.message = '';
    }

    ngOnDestroy() {
        this.commentsSubscription?.unsubscribe();
    }
}
