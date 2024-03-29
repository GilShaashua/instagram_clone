import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Chat } from '../../models/chat.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'chat-page',
    templateUrl: './chat-page.component.html',
    styleUrls: ['./chat-page.component.scss'],
    host: {
        class: 'page-cmp-layout',
    },
})
export class ChatPageComponent implements OnInit, OnDestroy {
    constructor(
        private userService: UserService,
        private chatService: ChatService,
        private authService: AuthService,
        private router: Router,
    ) {
        this.userService.setIsSearchModalShown(false);
    }

    chats: Chat[] = [];
    chatsSubscription!: Subscription;
    isChatPageInitialized = false;

    async ngOnInit() {
        this.chatService
            .getChatsForUser(this.authService.getLoggedInUser().uid)
            .subscribe({
                next: (chats) => {
                    this.chats = chats;
                    this.isChatPageInitialized = true;
                },
                error: (err: any) => {
                    console.error(err);
                },
            });
    }

    async onRemoveChat(chatId: string) {
        await this.chatService.removeChatById(
            chatId,
            this.authService.getLoggedInUser().uid,
        );
    }

    async navigateToAddChat() {
        await this.router.navigateByUrl('chat/add');
    }

    ngOnDestroy() {
        this.chatsSubscription?.unsubscribe();
    }
}
