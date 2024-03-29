import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { Chat } from '../../models/chat.model';
import { Message } from '../../models/message.model';
import { ChatService } from '../../services/chat.service';
import { User } from '../../models/user.model';
import { doc } from '@angular/fire/firestore';

@Component({
    selector: 'message-list',
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit {
    constructor(private chatService: ChatService) {}

    @Input() chat!: Chat;
    @Input() participantUser!: User;
    @Input() loggedInUserFromDB!: User;
    @Output() onScrollToBottom = new EventEmitter();

    messages!: Message[];

    ngOnInit() {
        this.getChatMessages();
    }

    getChatMessages() {
        this.chatService.getMessagesByChatId(this.chat._id).subscribe({
            next: (messages) => {
                this.messages = messages;
                this.scrollToBottom();
            },
        });
    }

    scrollToBottom() {
        this.onScrollToBottom.emit();
    }

    trackByMessageId(index: number, message: Message) {
        return message._id;
    }
}
