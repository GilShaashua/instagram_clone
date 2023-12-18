import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Subscription, take } from 'rxjs';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { Comment } from '../../models/comment.model.';

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
        private router: Router,
    ) {
        this.userService.setIsSearchModalShown(false);
    }

    posts!: Post[];
    postsSubscription!: Subscription;
    isToggleLikeProcessing = false;

    async ngOnInit() {
        const posts = await this.postService.getPosts();
        if (posts) {
            this.postsSubscription = posts.subscribe({
                next: (posts) => {
                    this.posts = posts;
                },
                error: (err: any) => {
                    console.error(err);
                },
            });
        }
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
            sender: this.authService.getLoggedInUser().uid,
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

    async onAddComment({ comment, post }: any) {
        await this.postService.addComment(comment, post);
    }

    async onAddReply(reply: Comment) {
        await this.postService.addReply(reply);
    }

    navigateToUserProfile(creatorId: string) {
        console.log('creatorId', creatorId);

        this.router.navigateByUrl(`profile/${creatorId}`);
    }

    navigateToCreatePost() {
        this.router.navigateByUrl('/create-post');
    }

    ngOnDestroy() {
        this.postsSubscription?.unsubscribe();
    }
}
