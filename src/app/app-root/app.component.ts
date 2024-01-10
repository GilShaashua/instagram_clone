import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedStateService } from '../services/shared-state.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    constructor(
        private router: Router,
        private sharedState: SharedStateService,
    ) {}

    routerUrl = this.router.url;
    routerUrlSubscription!: Subscription;
    isChatDetailsShown = false;
    chatDetailsSubscription!: Subscription;

    async ngOnInit() {
        this.getIsChatDetailsShown();

        this.routerUrlSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.routerUrl = this.router.url;
            }
        });
    }

    getIsChatDetailsShown() {
        this.chatDetailsSubscription =
            this.sharedState.isChatDetailsShown$.subscribe({
                next: (isChatDetailsShown) => {
                    this.isChatDetailsShown = isChatDetailsShown;
                },
            });
    }

    ngOnDestroy() {
        this.routerUrlSubscription?.unsubscribe();
        this.chatDetailsSubscription?.unsubscribe();
    }
}
