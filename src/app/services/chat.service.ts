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

    async addNewChat(newChat: Chat) {
        console.log('newChat', newChat);

        try {
            // Check for existing chats using two separate queries
            const firstCheck$ = this.db
                .collection('chats', (ref) =>
                    ref.where('users', 'array-contains', newChat.users[0]),
                )

                .valueChanges() as Observable<Chat[]>;
            const secondCheck$ = this.db
                .collection('chats', (ref) =>
                    ref.where('users', 'array-contains', newChat.users[1]),
                )

                .valueChanges() as Observable<Chat[]>;

            const firstResults = await firstValueFrom(firstCheck$);
            const secondResults = await firstValueFrom(secondCheck$);

            const existingChat = firstResults.find((chat) =>
                secondResults.some((otherChat) => otherChat._id === chat._id),
            );

            if (existingChat) {
                return existingChat._id;
            }
        } catch (error) {
            console.error('Error checking for existing chat:', error);
        }

        newChat.lastModified = Date.now();
        const newChatRef = await this.db.collection('chats').add(newChat);
        console.log('newChatRef', newChatRef);
        await this.db
            .collection('chats')
            .doc(newChatRef.id)
            .update({ _id: newChatRef.id });

        return newChatRef.id;
    }

    async removeChatById(chatId: string) {
        console.log('chatId', chatId);
        await this._removeMessagesForChatId(chatId);
        await this.db.collection('chats').doc(chatId).delete();
    }

    private async _removeMessagesForChatId(chatId: string) {
        console.log('chatId', chatId);
        // Get all messages
        const messages$ = this.db
            .collection('messages')
            .valueChanges() as Observable<Message[]>;
        const messages = await firstValueFrom(messages$);

        // Filter out messages related to the chat
        const filteredMessages = messages.filter(
            (message) => message.chatId === chatId,
        );

        // Delete each message
        for (const message of filteredMessages) {
            await this.db.collection('messages').doc(message._id).delete();
        }
    }
}
