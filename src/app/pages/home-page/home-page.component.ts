import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Observable, take } from 'rxjs';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
    constructor(
        private postService: PostService,
        private authService: AuthService,
        private userService: UserService,
        private notificationService: NotificationService,
    ) {
        this.userService.setIsSearchModalShown(false);
    }

    posts$!: Observable<Post[]>;
    isComponentInitialized = false;
    isToggleLikeProcessing = false;

    async ngOnInit() {
        const posts = await this.postService.getPosts();
        posts!.pipe(take(1)).subscribe({
            error: (err: any) => {
                console.error(err);
            },
            complete: () => {
                this.posts$ = this.postService.posts$;
                this.isComponentInitialized = true;
            },
        });
    }

    async onToggleLike(payload: { post: Post; isLikeClicked: boolean }) {
        if (this.isToggleLikeProcessing) return;

        this.isToggleLikeProcessing = true;

        await this.postService.toggleLike(payload.isLikeClicked, payload.post);

        this.isToggleLikeProcessing = false;
    }

    onToggleFollow({
        isFollowClicked,
        user,
    }: {
        isFollowClicked: boolean;
        user: User;
    }) {
        this.authService
            .getUserById(user._id)
            .pipe(take(1))
            .subscribe(async (_user: any) => {
                user = _user;
                await this.userService.toggleFollow(isFollowClicked, user);
            });
    }

    async onAddNotification(post: Post) {
        const notification = {
            sender: this.authService.getLoggedInUser()!.user!.uid,
            recipient: post.creatorId,
            message: '',
            createdAt: 0,
            madeAt: post,
            read: false,
        };
        await this.notificationService.addNotification(
            notification,
            'likeAction',
        );
    }

    onAddComment({ comment, post }: any) {
        this.postService.addComment(comment, post);
    }

    ngOnDestroy() {}
}
