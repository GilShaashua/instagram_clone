export interface Notification {
    id?: string;
    sender: string;
    recipient: string;
    message: string;
    madeAt: any;
    createdAt: number;
    read: boolean;
}
