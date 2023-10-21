import { User } from './user.model';

export interface Post {
    _id: string;
    creatorFullName: string;
    creatorId: string;
    createdAt: number;
    imgUrl: string;
    content: string;
    likedByUsers: User[];
    comments: any;
    filterSelected: string;
}
