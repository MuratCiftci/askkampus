import React from "react";
import CommentCard from "./CommentCard";
import { Comment } from "./index.type";
import CommentArea from "./CommentArea";

interface Props {
  comments: Comment[] | undefined;
}

const Comments = ({ comments }: Props) => {
  const [commentDropdown, setCommentDropdown] = React.useState(false);
  const totalCommentsWithReplies = comments?.reduce(
    (acc, comment) => acc + (comment.replies ? comment.replies.length : 0) + 1,
    0
  );

  return (
    <div className="bg-white py-8 antialiased dark:bg-gray-900 lg:py-16">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white lg:text-2xl">
            Yorumlar ({totalCommentsWithReplies})
          </h2>
        </div>
        <CommentArea commentType="comment" />
        {comments?.map((comment) => (
          <CommentCard comment={comment} key={comment.id} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
