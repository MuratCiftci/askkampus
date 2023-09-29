export type CommentCardProps = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    body: string;
    userId: string;
    postId: string;
    post: {
        title: string;
        id: string;
        community: {
            name: string;
        }
    },
    user: {
        name: string;
        id: string;
    }
};