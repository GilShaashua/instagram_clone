export interface Chat {
    _id: string;
    lastModified: number;
    isRead: boolean;
    shownByUsers: string[];
    users: string[];
    messages: string[];
}
