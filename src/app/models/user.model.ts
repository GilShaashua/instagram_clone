export interface User {
    _id: string,
    fullName: string,
    imgUrl: string,
    followedByUsers: string[],
    followingUsers: string[]
}