export interface Post {
    postId: string;
    timeCreate: bigint;
    userId: string;
    title: string;
    description: string;
    imageURL: string;
    latitude: number;
    longitude: number;
    commentCount: number;
    likesCount: number;
    postUrl: string;
}
