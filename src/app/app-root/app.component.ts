import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    routerUrl = this.router.url;
    routerUrlSubscription!: Subscription;

    constructor(
        private router: Router,
        private postService: PostService,
    ) {}

    async ngOnInit() {
        if (isDevMode()) {
            console.log('Development!');
        } else {
            console.log('Production!');
        }

        this.routerUrlSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.routerUrl = this.router.url;
            }
        });
        // this.postService
        //     .getPosts()
        //     .pipe(take(1))
        //     .subscribe({
        //         error: (err: any) => {
        //             console.error(err);
        //         },
        //         complete: () => {
        //             this.isComponentInitialized = true;
        //         },
        //     });
    }

    ngOnDestroy() {
        this.routerUrlSubscription.unsubscribe();
    }
}
