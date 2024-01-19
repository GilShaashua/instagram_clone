export interface Notification {
    _id?: string;
    sender: string;
    recipient: string;
    message: string;
    postId: string;
    postImgUrl: string;
    createdAt: number;
    read: boolean;
}
