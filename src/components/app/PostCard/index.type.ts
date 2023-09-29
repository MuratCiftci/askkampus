export type Post = {
  body: string;
  communityId: string;
  createdAt: Date;
  id: string;
  image_url?: string | null;
  title: string;
  updatedAt: Date;
  userId: string;
  community?: {
    name: string;
    image_url: string;
  };
  user?: {
    name: string | null;
    id: string;
  };
  _count?: {
    votes: number;
  };
};
