import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    routerUrl = this.router.url;
    routerUrlSubscription!: Subscription;

    constructor(private router: Router) {}

    async ngOnInit() {
        this.routerUrlSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.routerUrl = this.router.url;
            }
        });
    }

    ngOnDestroy() {
        this.routerUrlSubscription.unsubscribe();
    }
}
