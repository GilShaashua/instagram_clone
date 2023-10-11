export interface Creator {
    _id: string,
    fullName: string,
    imgUrl: string,
    followedByUsers: string[],
    followingUsers: string[]
}