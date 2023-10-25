export interface User {
    _id: string;
    fullName: string;
    imgUrl: string;
    followedByUsers: User[];
    followingUsers: User[];
    notifications: any;
}
