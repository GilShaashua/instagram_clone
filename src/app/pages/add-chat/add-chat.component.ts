import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chat } from '../../models/chat.model';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';
import { SharedStateService } from '../../services/shared-state.service';
import { ChatService } from '../../services/chat.service';

@Component({
    selector: 'add-chat',
    templateUrl: './add-chat.component.html',
    styleUrls: ['./add-chat.component.scss'],
    host: {
        class: 'page-cmp-layout',
    },
})
export class AddChatComponent implements OnInit, OnDestroy {
    constructor(
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
        private sharedStateService: SharedStateService,
        private chatService: ChatService,
    ) {
        this.sharedStateService.setChatDetailsShown(true);
    }

    newChat: Chat = {
        _id: '',
        lastModified: 0,
        isRead: false,
        users: [this.authService.getLoggedInUser().uid, ''],
        messages: [],
    };
    filterBy = { account: '' };
    users!: User[];

    async ngOnInit() {
        await this.getUsers();
    }

    async getUsers() {
        const users$ = this.userService.getUsers(this.filterBy);
        const users = await firstValueFrom(users$);
        this.users = users;
    }

    async onAddNewChat(userId: string) {
        this.newChat.users[1] = userId;
        const chatId = await this.chatService.addNewChat(this.newChat);
        await this.router.navigateByUrl(`chat/${chatId}`);
    }

    navigateToChatPage() {
        this.router.navigateByUrl('chat');
    }

    ngOnDestroy() {
        this.sharedStateService.setChatDetailsShown(false);
    }
}
