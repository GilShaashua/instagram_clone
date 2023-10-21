import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Observable, take } from 'rxjs';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'home-page-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
    constructor(
        private postService: PostService,
        private authService: AuthService,
        private userService: UserService,
    ) {}

    posts$!: Observable<Post[]>;
    isComponentInitialized = false;

    ngOnInit() {
        this.postService
            .getPosts()
            .pipe(take(1))
            .subscribe({
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
        await this.postService.toggleLike(payload.isLikeClicked, payload.post);
    }

    onToggleFollow(payload: {
        post: Post;
        user: User;
        isFollowClicked: boolean;
    }) {
        this.authService
            .getUserById(payload.user._id)
            .pipe(take(1))
            .subscribe(async (user: any) => {
                payload.user = user;
                await this.userService.toggleFollow(
                    payload.isFollowClicked,
                    payload.user,
                    payload.post,
                );

                // const posts$ = this.postService.getPosts().pipe(take(1));
                // const posts = await lastValueFrom(posts$);
                // console.log('posts refreshed after toggleFollow', posts);
            });
    }

    ngOnDestroy() {}
}
