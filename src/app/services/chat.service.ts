import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Chat } from '../models/chat.model';
import { firstValueFrom, Observable, take, tap } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    constructor(private db: AngularFirestore) {}

    getChatsForUser(userId: string) {
        const chatsRef = this.db.collection('chats', (ref) =>
            ref
                .where('users', 'array-contains', userId)
                .orderBy('lastModified', 'desc'),
        );

        return chatsRef.valueChanges() as Observable<Chat[]>;
    }

    getChatById(chatId: string) {
        return this.db
            .collection('chats')
            .doc(chatId)
            .valueChanges() as Observable<Chat>;
    }

    async addMessageToChat(chatId: string, message: Message) {
        message.sentAt = Date.now();

        const messageRef = await this.db.collection('messages').add(message);

        await this.db
            .collection('messages')
            .doc(messageRef.id)
            .update({ _id: messageRef.id });

        const chat$ = this.db
            .collection('chats')
            .doc(chatId)
            .valueChanges()
            .pipe(take(1));
        const chat = (await firstValueFrom(chat$)) as Chat;

        const updatedMessages = [...chat.messages, messageRef.id];

        await this.db
            .collection('chats')
            .doc(chatId)
            .update({ messages: updatedMessages });
    }

    getMessageById(messageId: string) {
        return this.db
            .collection('messages')
            .doc(messageId)
            .valueChanges() as Observable<Message>;
    }

    getMessagesByChatId(chatId: string) {
        return this.db
            .collection('messages', (ref) =>
                ref.where('chatId', '==', chatId).orderBy('sentAt', 'asc'),
            )
            .valueChanges() as Observable<Message[]>;
    }
}
