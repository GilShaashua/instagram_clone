import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Chat } from '../../models/chat.model';
import { Location } from '@angular/common';

@Component({
    selector: 'chat-details',
    templateUrl: './chat-details.component.html',
    styleUrls: ['./chat-details.component.scss'],
    host: {
        class: 'page-cmp-layout',
    },
})
export class ChatDetailsComponent implements OnInit, OnDestroy {
    constructor(
        private route: ActivatedRoute,
        private location: Location,
    ) {}

    chat!: Chat;
    dataSubscription!: Subscription;

    ngOnInit() {
        this.dataSubscription = this.route.data
            .pipe(
                tap((data) => {
                    console.log(data);
                }),
                map((data) => data['chat']),
            )
            .subscribe({
                next: (chat) => {
                    !chat ? this.location.back() : (this.chat = chat);
                },
            });
    }

    sendMessage() {
        // code to send a message
    }

    goBack() {
        this.location.back();
    }

    ngOnDestroy() {}
}
