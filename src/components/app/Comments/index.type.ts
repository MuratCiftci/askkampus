export interface Comment {
    id: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string;
        image?: string;
    };
    replies?: Comment[];
}
