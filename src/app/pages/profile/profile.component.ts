import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, map, take } from 'rxjs';
import { User } from '../../models/user.model';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    // host: {
    //     class: 'page-cmp-layout',
    // },
})
export class ProfileComponent implements OnInit, OnDestroy {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private postService: PostService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
    ) {
        this.userService.setIsSearchModalShown(false);
    }

    userFromDB!: User;
    userPosts!: Post[];
    userPostsSubscription!: Subscription;
    dataSubscription!: Subscription;

    ngOnInit(): void {
        console.log('mounted');

        this.dataSubscription = this.route.data
            .pipe(map((data) => data['user']))
            .subscribe({
                next: (user) => {
                    // console.log('user', user);

                    !user ? this.location.back() : (this.userFromDB = user);
                },
            });
        this.getPostsForUser();
    }

    getPostsForUser() {
        const userPosts$ = this.postService.getPostsForUser(
            this.userFromDB._id,
        );

        this.userPostsSubscription = userPosts$.subscribe({
            next: (posts) => {
                this.userPosts = posts;
            },
            error: (err: any) => {
                console.error(err);
            },
        });
    }

    ngOnDestroy(): void {
        this.userPostsSubscription?.unsubscribe();
        this.dataSubscription?.unsubscribe();
    }
}
