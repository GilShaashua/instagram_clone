import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Chat } from '../models/chat.model';
import { Observable } from 'rxjs';

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
}
