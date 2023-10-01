import React from "react";
import { Comment } from "./index.type";
import dayjs from "dayjs";
import CommentArea from "./CommentArea";
import { Modal } from "~/components/shared/ui/Modal";
import { Button } from "~/components/shared/ui/Button";
import { DeleteIcon, Trash, Trash2 } from "lucide-react";
import { api } from "~/utils/api";
import { toast } from "~/components/hooks/ui/use-toast";

type Props = {
  comment: Comment;
  isReply?: boolean;
};

const CommentCard = ({ comment, isReply }: Props) => {
  const [openReplyArea, setOpenReplyArea] = React.useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = React.useState(false);
  const utils = api.useContext();
  const deleteMutate = api.user.deleteComment.useMutation({
    onSuccess: async () => {
      toast({ title: "Yorum silindi" });
      await utils.post.getComments.invalidate();
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });
  const handleDelete = () => {
    // delete comment
    deleteMutate.mutate({ id: comment.id });
    setConfirmDeleteModal(false);
  };
  return (
    <article className="rounded-lg bg-white pl-6 pt-6 pb-6 text-base dark:bg-gray-900 dark:text-white">
      <footer className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <p className="mr-3 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
            <img
              // eslint-disable-next-line @next/next/no-img-element
              className="mr-2 h-6 w-6 rounded-full"
              src={comment.user.image || ""}
              alt={comment?.user.name || ""}
            />
            {comment.user.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <p>{dayjs(comment.createdAt).format("DD MMMM YYYY")}</p>
          </p>
        </div>
        <div className="position-relative flex flex-col items-center">
          <Button
            variant="ghost"
            type="button"
            onClick={() => setConfirmDeleteModal(true)}
          >
            <Trash2 size={20} />
          </Button>
        </div>
      </footer>
      <p className="text-gray-500 dark:text-gray-400">{comment.body}</p>
      {isReply ? null : (
        <div className="mt-4 flex items-center space-x-4">
          <button
            onClick={() => setOpenReplyArea(!openReplyArea)}
            type="button"
            className="flex items-center text-sm font-medium text-gray-500 hover:underline dark:text-gray-400"
          >
            <svg
              className="mr-1.5 h-3.5 w-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 18"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
              />
            </svg>
            Reply
          </button>
        </div>
      )}
      {openReplyArea ? (
        <CommentArea
          commentType={isReply ? "replyToReply" : "reply"}
          comment_id={comment.id}
          reply_id={isReply ? comment.id : undefined}
          setOpenReplyArea={setOpenReplyArea}
        />
      ) : null}
      {comment?.replies?.map((nestedComment) => (
        <>
          <CommentCard
            comment={nestedComment}
            key={nestedComment.id}
            isReply={true}
          />
        </>
      ))}

      <Modal
        handleOpen={() => setConfirmDeleteModal(true)}
        handleClose={() =>  setConfirmDeleteModal(false)}
        handleDelete={handleDelete}
        open={confirmDeleteModal}
      />
    </article>
  );
};

export default CommentCard;
