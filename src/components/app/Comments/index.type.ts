export interface Comment {
    id: string;
    body: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        image: string;
    };
    replies: Comment[];
}
