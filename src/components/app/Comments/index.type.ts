export interface Comment {
    id: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string | null;
        name: string | null;
        image?: string | null;
    };
    replies?: Comment[];
} 
