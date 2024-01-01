import { Component, Input } from '@angular/core';
import { Chat } from '../../models/chat.model';

@Component({
    selector: 'chat-list',
    templateUrl: './chat-list.component.html',
    styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent {
    @Input() chats!: Chat[];

    trackByChatId(index: number, chat: Chat): string {
        return chat._id;
    }
}
