export interface Comment {
    _id?: string;
    parentId: string;
    isTopLevel: boolean;
    postId: string;
    createdByUserId: any;
    message: string;
    createdAt: number;
    replies?: string[] | Comment[];
}
