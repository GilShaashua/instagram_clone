import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Chat } from '../../models/chat.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom, last, Subscription } from 'rxjs';
import { Message } from '../../models/message.model';
import { ChatService } from '../../services/chat.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

@Component({
    selector: 'chat-preview',
    templateUrl: './chat-preview.component.html',
    styleUrls: ['./chat-preview.component.scss'],
})
export class ChatPreviewComponent implements OnInit, OnDestroy {
    constructor(
        private authService: AuthService,
        private chatService: ChatService,
        private postService: PostService,
    ) {}

    @Input() chat!: Chat;
    @Output() onRemoveChat = new EventEmitter();

    loggedInUserFromDB!: User;
    participantUser!: User;
    isComponentInitialized = false;
    lastMessage?: Message;
    chatSubscription!: Subscription;
    post?: Post;

    async ngOnInit() {
        await this.getLoggedInUserFromDB();
        await this.getParticipantUser();
        await this.getLastMessage();
        this.isComponentInitialized = true;
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

        if (!participantUserId) participantUserId = this.loggedInUserFromDB._id;

        const participantUser$ =
            this.authService.getUserById(participantUserId);
        this.participantUser = await firstValueFrom(participantUser$);
    }

    async getLastMessage() {
        this.chatSubscription = this.chatService
            .getChatById(this.chat._id)
            .subscribe({
                next: async (chat) => {
                    this.chat = chat;

                    // Get last message
                    const message$ = this.chatService.getMessageById(
                        this.chat.messages[this.chat.messages.length - 1],
                    );

                    let lastMessage = await firstValueFrom(message$);

                    if (!lastMessage) {
                        lastMessage = {
                            _id: '',
                            chatId: this.chat._id,
                            sentAt: 0,
                            sentBy: this.loggedInUserFromDB._id,
                            txt: 'No messages yet',
                        };
                    }

                    if (lastMessage) this.lastMessage = lastMessage;

                    if (lastMessage?.postId) {
                        this.post = await this.postService.getPostById(
                            lastMessage.postId,
                        );
                    }
                },
            });
    }

    removeChat(ev: Event) {
        ev.stopPropagation();
        this.onRemoveChat.emit(this.chat._id);
    }

    ngOnDestroy() {
        this.chatSubscription?.unsubscribe();
    }
}
