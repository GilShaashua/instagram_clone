import { Message } from './message.model';

export interface Chat {
    _id: string;
    lastModified: number;
    isRead: boolean;
    users: string[];
    messages: Message[];
}
