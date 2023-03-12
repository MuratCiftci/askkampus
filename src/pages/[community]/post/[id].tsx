import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

const Post = () => {
  const router = useRouter();

  const { id, community } = router.query as { id: string , community: string};

  // fetch post by id

  const { data: post, isLoading } = api.post.getPostByIdAndCommunity.useQuery({
    community_name: community,
    id:  id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      Post : {id} name : {post.title} body : {post.body}

      <div>
        <Link href={"/" } >Gooo</Link>
      </div>
    </div>
  );
};

export default Post;
