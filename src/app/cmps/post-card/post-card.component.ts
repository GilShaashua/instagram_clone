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
import { firstValueFrom, Subscription, take } from 'rxjs';
import { User } from '../../models/user.model';
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
    postsSubscription!: Subscription;

    async ngOnInit() {
        this.postsSubscription = this.postService.posts$.subscribe({
            next: async (posts) => {
                const usersPrms = this.post.likedByUsers.map(
                    async (likedByUser) => {
                        const user$ = this.authService
                            .getUserById(likedByUser as unknown as string)
                            .pipe(take(1));

                        return await firstValueFrom(user$);
                    },
                );

                this.post.likedByUsers = await Promise.all(usersPrms);
            },
        });

        this.postService
            .getCommentsByPostId(this.post._id)
            .pipe(take(1))
            .subscribe({
                next: (comments) => {
                    this.commentsLength = comments.length;
                },
            });

        this.authService
            .getUserById(this.post.creatorId)
            .pipe(take(1))
            .subscribe({
                next: (creator: any) => {
                    this.creator = creator;
                    const isLikeClicked = this.post.likedByUsers.find(
                        (likedByUser: User) =>
                            likedByUser._id === this.loggedInUser?.user?.uid ||
                            likedByUser ===
                                (this.loggedInUser?.user?.uid as User | string),
                    );
                    if (isLikeClicked) this.isLikeClicked = true;
                    this.isComponentInitialized = true;
                },
            });
    }

    toggleLike() {
        this.isLikeClicked = !this.isLikeClicked;

        this.onToggleLike.emit({
            post: this.post,
            isLikeClicked: this.isLikeClicked,
        });

        this.isLikeClicked && this.onAddNotification.emit(this.post);
    }

    toggleLikedByUsersModal(isLikedByUsersModalShown: boolean) {
        this.isLikedByUsersModalShown = isLikedByUsersModalShown;
    }

    onToggleCommentModal() {
        this.isCommentModalShown = !this.isCommentModalShown;
    }

    ngOnDestroy() {
        this.postsSubscription.unsubscribe();
    }
}
