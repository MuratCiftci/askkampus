import { useRouter } from "next/router";
import React from "react";
import { toast } from "~/components/hooks/ui/use-toast";
import { api } from "~/utils/api";

type CommentAreaProps = {
  comment_id?: string;
  reply_id?: string;
  commentType: "comment" | "reply" | "replyToReply";
  parent_comment_id?: string;
  setOpenReplyArea?: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentArea = ({
  commentType,
  comment_id,
  reply_id,
  setOpenReplyArea,
}: CommentAreaProps) => {
  const utils = api.useContext();
  const router = useRouter();
  const { id } = router.query as { id: string; community: string };
  const scroolToComment = () => {
    const element = document.getElementById("comments");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const addCommentMutate = api.post.addComment.useMutation({
    onSuccess: async () => {
      await utils.post.getComments.invalidate({ postId: id });
      // scroll to bottom
      scroolToComment();
      toast({ title: "Comment added" });
    },
  });

  const addReplyMutate = api.post.addReply.useMutation({
    onSuccess: async () => {
      await utils.post.getComments.invalidate({ postId: id });
      setOpenReplyArea && setOpenReplyArea(false);
      scroolToComment();
      toast({ title: "Comment added" });
    },
  });

  //   const addReplyToReplyMutate = api.post.addReplyToReply.useMutation({
  //     onSuccess: async () => {
  //       await utils.post.getComments.invalidate({ postId: id });
  //       setOpenReplyArea && setOpenReplyArea(false);
  //       scroolToComment();
  //       toast({ title: "Comment added" });
  //     },
  //   });

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

  //   const addReplyToReply = (
  //     e: React.FormEvent<HTMLFormElement>,
  //     reply_id: string,
  //     comment_id: string
  //   ) => {
  //     e.preventDefault();
  //     const formData = new FormData(e.currentTarget);
  //     const name = formData.get("comment");
  //     debugger;
  //     if (typeof name === "string") {
  //       addReplyToReplyMutate.mutate({
  //         reply_id: reply_id,
  //         body: name,
  //         comment_id: comment_id,
  //       });
  //     }

  //     e.currentTarget.reset();
  //   };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    switch (commentType) {
      case "comment":
        addComment(e);
        break;
      case "reply":
        if (!comment_id) return;
        addReply(e, comment_id);
        break;
    }
  };

  return (
    <form className="mb-6 mt-2" onSubmit={handleSubmit}>
      <div className="mb-4 rounded-lg rounded-t-lg border border-gray-200 bg-white py-2 px-4 dark:border-gray-700 dark:bg-gray-800">
        <label htmlFor="comment" className="sr-only">
          Your comment
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={6}
          className="w-full border-0 px-0 text-sm text-gray-900 focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          placeholder="Yorumunuzu yazın..."
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="inline-flex items-center rounded-lg bg-primary-700 py-2.5 px-4 text-center text-xs font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900"
      >
        {addCommentMutate.isLoading || addReplyMutate.isLoading
          ? "Ekleniyor..."
          : "Yorum Yap"}
      </button>
    </form>
  );
};

export default CommentArea;
