import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { Post } from '../../models/post.model';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom, take } from 'rxjs';
import { User } from '../../models/user.model';
import { PostService } from '../../services/post.service';
import cloneDeep from 'lodash-es/cloneDeep';

@Component({
    selector: 'post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit, OnChanges {
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
    @Output() onAddReply = new EventEmitter();
    @Output() onClickUserImg = new EventEmitter();
    @Output() onClickLikedByUsers = new EventEmitter();
    @Output() onCloseLikedByUsers = new EventEmitter();

    creator!: User;
    isMoreClicked = false;
    isLikedByUsersModalShown = false;
    loggedInUser = this.authService.getLoggedInUser();
    isLikeClicked = false;
    isComponentInitialized = false;
    isCommentModalShown = false;
    commentsLength = 0;
    likedByUsersCloneDeep!: User[];

    async ngOnInit() {
        const usersPrms = this.post.likedByUsers?.map(
            async (likedByUser: string | User) => {
                if (typeof likedByUser !== 'string')
                    likedByUser = likedByUser._id as string;

                const user$ = this.authService
                    .getUserById(likedByUser as unknown as string)
                    .pipe(take(1));

                return await firstValueFrom(user$);
            },
        );

        this.post.likedByUsers = await Promise.all(usersPrms);

        if (typeof this.post.likedByUsers?.[0] !== 'object') {
            const usersPrms = this.post.likedByUsers?.map(
                async (likedByUser: string | User) => {
                    if (typeof likedByUser !== 'string')
                        likedByUser = likedByUser._id as string;

                    const user$ = this.authService
                        .getUserById(likedByUser as unknown as string)
                        .pipe(take(1));

                    return await firstValueFrom(user$);
                },
            );

            this.post.likedByUsers = await Promise.all(usersPrms);
        }

        this.likedByUsersCloneDeep = cloneDeep(this.post.likedByUsers);

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
                            likedByUser._id === this.loggedInUser.uid ||
                            likedByUser ===
                                (this.loggedInUser.uid as User | string),
                    );
                    if (isLikeClicked) this.isLikeClicked = true;
                    this.isComponentInitialized = true;
                },
            });
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (!this.isComponentInitialized) return;

        if (changes['post']) {
            try {
                const usersPrms = this.post.likedByUsers.map(
                    async (likedByUser) => {
                        const user$ = this.authService
                            .getUserById(likedByUser as unknown as string)
                            .pipe(take(1));

                        return await firstValueFrom(user$);
                    },
                );

                this.post.likedByUsers = await Promise.all(usersPrms);

                let count = 0;
                this.post.likedByUsers.forEach((likedByUser) => {
                    if (typeof likedByUser === 'object') count++;
                });

                if (count === this.post.likedByUsers.length) {
                    this.likedByUsersCloneDeep = cloneDeep(
                        this.post.likedByUsers,
                    );
                }
            } catch (err) {
                console.error(err);
            }
        }
    }

    toggleLike() {
        this.isLikeClicked = !this.isLikeClicked;

        this.onToggleLike.emit({
            post: this.post,
            isLikeClicked: this.isLikeClicked,
        });

        this.loggedInUser.uid !== this.creator._id &&
            this.isLikeClicked &&
            this.onAddNotification.emit(this.post);
    }

    toggleLikedByUsersModal(isLikedByUsersModalShown: boolean) {
        this.isLikedByUsersModalShown = isLikedByUsersModalShown;
    }

    onToggleCommentModal() {
        this.isCommentModalShown = !this.isCommentModalShown;
    }

    getTypeOfLikedByUsers() {
        return typeof this.post.likedByUsers[0];
    }
}
