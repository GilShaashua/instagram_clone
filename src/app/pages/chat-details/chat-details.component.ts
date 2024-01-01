import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, map, Subscription, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Chat } from '../../models/chat.model';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
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
        private authService: AuthService,
    ) {}

    chat!: Chat;
    dataSubscription!: Subscription;
    loggedInUserFromDB!: User;
    participantUser!: User;
    isComponentInitialized = false;

    async ngOnInit() {
        this.dataSubscription = this.route.data
            .pipe(map((data) => data['chat']))
            .subscribe({
                next: (chat) => {
                    !chat ? this.location.back() : (this.chat = chat);
                },
            });

        await this.getLoggedInUserFromDB();
        await this.getParticipantUser();

        console.log('loggedInUserFromDB', this.loggedInUserFromDB);
        console.log('participantUser', this.participantUser);

        this.isComponentInitialized = true;
    }

    sendMessage() {
        // code to send a message
    }

    async getLoggedInUserFromDB() {
        const loggedInUserFromDB$ = this.authService.getUserById(
            this.authService.getLoggedInUser().uid,
        );
        this.loggedInUserFromDB = await firstValueFrom(loggedInUserFromDB$);
    }

    async getParticipantUser() {
        let participantUserId = this.chat.users.filter(
            (userId) => userId !== this.loggedInUserFromDB._id,
        )[0];

        const participantUser$ =
            this.authService.getUserById(participantUserId);
        this.participantUser = await firstValueFrom(participantUser$);
    }

    goBack() {
        this.location.back();
    }

    ngOnDestroy() {}
}

import { User } from '../../models/user.model';
