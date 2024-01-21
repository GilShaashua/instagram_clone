import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Chat } from '../models/chat.model';
import { filter, firstValueFrom, map, Observable, take, tap } from 'rxjs';
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

        return chatsRef.valueChanges().pipe(
            map((chats) =>
                chats.filter((chat) => {
                    return (chat as Chat).shownByUsers.includes(userId);
                }),
            ),
        ) as Observable<Chat[]>;
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

    async addNewChat(newChat: Chat, loggedInUserId: string) {
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
                if (!existingChat.shownByUsers.includes(loggedInUserId)) {
                    await this.db
                        .collection('chats')
                        .doc(existingChat._id)
                        .update({
                            shownByUsers: [
                                ...existingChat.shownByUsers,
                                loggedInUserId,
                            ],
                        });
                }
                return existingChat;
            }
        } catch (error) {
            console.error('Error checking for existing chat:', error);
        }

        newChat.lastModified = Date.now();
        const newChatRef = await this.db.collection('chats').add(newChat);
        await this.db
            .collection('chats')
            .doc(newChatRef.id)
            .update({ _id: newChatRef.id });

        const chat$ = this.db
            .collection('chats')
            .doc(newChatRef.id)
            .valueChanges() as Observable<Chat>;
        const chat = await firstValueFrom(chat$);

        return chat;
    }

    async removeChatById(chatId: string, loggedInUserId: string) {
        const chat$ = this.db
            .collection('chats')
            .doc(chatId)
            .valueChanges() as Observable<Chat>;
        const chat = await firstValueFrom(chat$);
        const loggedInUserIdx = chat.shownByUsers.findIndex(
            (userId) => userId === loggedInUserId,
        );
        chat.shownByUsers.splice(loggedInUserIdx, 1);

        await this.db
            .collection('chats')
            .doc(chatId)
            .update({ shownByUsers: chat.shownByUsers });
    }
}
