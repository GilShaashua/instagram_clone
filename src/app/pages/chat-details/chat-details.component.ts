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
        private chatService: ChatService,
    ) {}

    dataSubscription!: Subscription;
    chat!: Chat;
    chatId!: string;
    loggedInUserFromDB!: User;
    participantUser!: User;
    isComponentInitialized = false;
    paramsSubscription!: Subscription;

    message: Message = {
        _id: '',
        chatId: '',
        sentAt: 0,
        sentBy: this.authService.getLoggedInUser().uid,
        txt: '',
    };

    async ngOnInit() {
        this.dataSubscription = this.route.data
            .pipe(map((data) => data['chat']))
            .subscribe({
                next: (chat) => {
                    !chat ? this.location.back() : (this.chat = chat);
                    chat ? (this.message.chatId = chat._id) : '';
                },
            });

        this.paramsSubscription = this.route.params.subscribe({
            next: async (params) => {
                params['chatId']
                    ? (this.chatId = params['chatId'])
                    : this.location.back();
            },
        });

        await this.getLoggedInUserFromDB();
        await this.getParticipantUser();

        this.isComponentInitialized = true;
    }

    async onAddMessage() {
        const messageClone = cloneDeep(this.message);
        await this.chatService.addMessageToChat(this.chat._id, messageClone);
        console.log(messageClone);
        this.message.txt = '';
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

    ngOnDestroy() {
        this.paramsSubscription?.unsubscribe();
        this.dataSubscription?.unsubscribe();
    }
}

import { User } from '../../models/user.model';
import { Message } from '../../models/message.model';
import cloneDeep from 'lodash-es/cloneDeep';
import { ChatService } from '../../services/chat.service';
