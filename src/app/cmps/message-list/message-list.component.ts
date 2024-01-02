import { Component, Input, OnInit } from '@angular/core';
import { Chat } from '../../models/chat.model';
import { Message } from '../../models/message.model';
import { ChatService } from '../../services/chat.service';

@Component({
    selector: 'message-list',
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit {
    constructor(private chatService: ChatService) {}

    @Input() chat!: Chat;

    messages!: Message[];

    ngOnInit() {
        this.getChatMessages();
    }

    getChatMessages() {
        this.chatService.getMessagesByChatId(this.chat._id).subscribe({
            next: (messages) => {
                console.log('messages', messages);
                this.messages = messages;
            },
        });
    }

    trackByMessageId(index: number, message: any) {}
}
