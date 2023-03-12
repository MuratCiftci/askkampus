import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "~/components/hooks/ui/use-toast";
import { api } from "~/utils/api";

const Post = () => {
  const router = useRouter();

  const { id, community } = router.query as { id: string; community: string };

  // fetch post by id

  const { data: post, isLoading } = api.post.getPostByIdAndCommunity.useQuery({
    community_name: community,
    id: id,
  });

  const { data: comments, isLoading: commentsLoading } =
    api.post.getComments.useQuery({
      postId: id,
    });

  //add comment

  const utils = api.useContext();

  const addCommentMutate = api.post.addComment.useMutation({
    onSuccess: async () => {
      await utils.post.getComments.invalidate({ postId: id });

      toast({ title: "Comment added" });
    },
  });

  const addReplyMutate = api.post.addReply.useMutation({
    onSuccess: async () => {
      await utils.post.getComments.invalidate({ postId: id });

      toast({ title: "Comment added" });
    },
  });

  const addReplyToReplyMutate = api.post.addReplyToReply.useMutation({
    onSuccess: async () => {
      await utils.post.getComments.invalidate({ postId: id });

      toast({ title: "Comment added" });
    },
  });

  // THIS IS JUST A TEST- I WILL OF COURSE MAKE A COMPONENT FOR EACH ONE OF THEM
  const addComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("comment");
    if (typeof name === "string") {
      addCommentMutate.mutate({ postId: id, body: name });
    }

    e.currentTarget.reset();
  };

  const addReply = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("comment");
    if (typeof name === "string") {
      addReplyMutate.mutate({ commentId: id, body: name });
    }

    e.currentTarget.reset();
  };

  const addReplyToReply = (
    e: React.FormEvent<HTMLFormElement>,
    reply_id: string,
    comment_id: string
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("comment");
    if (typeof name === "string") {
      addReplyToReplyMutate.mutate({
        reply_id: reply_id,
        body: name,
        comment_id: comment_id,
      });
    }

    e.currentTarget.reset();
  };

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
        <Link href={"/"}>Gooo</Link>
      </div>
      <div>
        <form onSubmit={addComment}>
          <input
            type="text"
            name="comment"
            className="border border-gray-300"
          />
          <button type="submit">Add comment</button>
        </form>
      </div>
      <div className="mt-4">
        Comments :
        {commentsLoading ? (
          <div>Loading...</div>
        ) : (
          comments?.map((comment) => (
            <div key={comment.id}>
              <div> {comment.body} </div>
              <div> {comment.user.name} </div>

              <div className="mt-4">
                <div className="mt-4">
                  Replies :
                  {comment.replies.map((reply) => (
                    <div key={reply.id}>
                      <div> {reply.body} </div>
                      <div> {reply.user.name} </div>
                      <div className="mt-4">
                        Nested Replies :
                        {reply.children?.map((nestedReply) => (
                          <div key={nestedReply.id}>
                            <div> {nestedReply.body} </div>
                            <div> {nestedReply.user.name} </div>
                          </div>
                        ))}
                        <div className="mt-4">
                          <form
                            onSubmit={(e) =>
                              addReplyToReply(e, reply.id, comment.id)
                            }
                          >
                            <input
                              type="text"
                              name="comment"
                              className="border border-gray-300"
                            />
                            <button type="submit">Add Reply to reply</button>
                          </form>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={(e) => addReply(e, comment.id)}>
                  <input
                    type="text"
                    name="comment"
                    className="border border-gray-300"
                  />
                  <button type="submit">Add reply</button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Post;
