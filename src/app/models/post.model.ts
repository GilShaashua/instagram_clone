export interface Post {
    _id: string,
    creatorFullName: string,
    creatorId: string,
    createdAt: number,
    imgUrl: string,
    content: string,
    likedByUsers: string[],
    comments: any
}