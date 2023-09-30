import React from "react";
import { api } from "~/utils/api";
import CommentCard from "./CommentCard";

type UserCommentsProps = {
  id: string;
};

const UserComments = ({ id }: UserCommentsProps) => {
  const {
    isLoading,
    data: comments,
    error,
  } = api.user.getUserComments.useQuery({ id: id });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center">
      {comments.map((comment) => {
        return <CommentCard comment={comment} key={comment.id} />;
      })}
    </div>
  );
};

export default UserComments;
