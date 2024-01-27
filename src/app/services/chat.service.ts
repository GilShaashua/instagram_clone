import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Chat } from '../models/chat.model';
import { firstValueFrom, map, Observable } from 'rxjs';
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

    async addMessageToChat(
        chatId: string,
        message: Message,
        participantUserId: string,
        loggedInUserId: string,
    ) {
        message.sentAt = Date.now();

        const messageRef = await this.db.collection('messages').add(message);

        await this.db
            .collection('messages')
            .doc(messageRef.id)
            .update({ _id: messageRef.id });

        const chat$ = this.db.collection('chats').doc(chatId).valueChanges();
        const chat = (await firstValueFrom(chat$)) as Chat;

        const updatedMessages = [...chat.messages, messageRef.id];

        await this.db
            .collection('chats')
            .doc(chatId)
            .update({ messages: updatedMessages, lastModified: Date.now() });

        if (participantUserId !== loggedInUserId) {
            if (!chat.shownByUsers.includes(participantUserId)) {
                await this.db
                    .collection('chats')
                    .doc(chat._id)
                    .update({
                        shownByUsers: [...chat.shownByUsers, participantUserId],
                    });
            }

            if (!chat.shownByUsers.includes(loggedInUserId)) {
                await this.db
                    .collection('chats')
                    .doc(chat._id)
                    .update({
                        shownByUsers: [...chat.shownByUsers, loggedInUserId],
                    });
            }
        } else {
            if (!chat.shownByUsers.includes(loggedInUserId)) {
                await this.db
                    .collection('chats')
                    .doc(chat._id)
                    .update({
                        shownByUsers: [...chat.shownByUsers, loggedInUserId],
                    });
            }
        }
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

    async addNewChat(
        newChat: Chat,
        loggedInUserId: string,
        participantUserId: string,
    ) {
        try {
            // Check for existing chats
            const loggedInUserChats$ = this.db
                .collection('chats', (ref) =>
                    ref.where('users', 'array-contains', loggedInUserId),
                )

                .valueChanges() as Observable<Chat[]>;

            const loggedInUserChats = await firstValueFrom(loggedInUserChats$);
            const existingChats = loggedInUserChats.filter((chat) =>
                chat.users.includes(participantUserId),
            );

            let existingChat;

            // If existingChats.length > 1, it means that the loggedInUser
            // wants to send a message to himself
            if (existingChats.length > 1) {
                existingChat = existingChats.find((chat) =>
                    chat.users.every((userId) => userId === loggedInUserId),
                );
                // If existingChats.length === 1,
                // it means that loggedInUser wants to send a message
                // to other user and not to him self
            } else {
                existingChat = existingChats[0];
            }

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

        const newAddedChat$ = this.db
            .collection('chats')
            .doc(newChatRef.id)
            .valueChanges() as Observable<Chat>;
        const newAddedChat = await firstValueFrom(newAddedChat$);

        return newAddedChat;
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
