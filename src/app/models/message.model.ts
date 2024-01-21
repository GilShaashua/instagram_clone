export interface Message {
    _id: string;
    chatId: string;
    postId?: string;
    sentAt: number;
    sentBy: string;
    txt: string;
}
