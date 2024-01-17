import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Chat } from '../../models/chat.model';

@Component({
    selector: 'chat-list',
    templateUrl: './chat-list.component.html',
    styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
    @Input() chats!: Chat[];
    @Output() onRemoveChat = new EventEmitter();

    ngOnInit() {
        // console.log('chats', this.chats);
    }

    trackByChatId(index: number, chat: Chat): string {
        return chat._id;
    }
}
