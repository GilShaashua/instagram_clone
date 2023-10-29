export interface Comment {
    _id?: string;
    parentId: string;
    postId: string;
    createdByUserId: any;
    message: string;
    createdAt: number;
}
