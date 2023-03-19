export type Post = {
  body: string;
  communityId: string;
  createdAt: Date;
  id: string;
  image_url?: string | null;
  title: string;
  updatedAt: Date;
  userId: string;
  community : {
    name: string | null;
  };
  user : {
    name: string | null;
  };
};
