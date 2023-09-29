import React from "react";
import { Comment } from "./index.type";
import dayjs from "dayjs";
import CommentArea from "./CommentArea";

type Props = {
  comment: Comment;
  isReply?: boolean;
};

const CommentCard = ({ comment, isReply }: Props) => {
  const [openReplyArea, setOpenReplyArea] = React.useState(false);
  console.log(comment, "comment");
  return (
    <article className="rounded-lg bg-white pl-6 pt-6 pb-6 text-base dark:bg-gray-900 dark:text-white">
      <footer className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <p className="mr-3 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
            <img
              // eslint-disable-next-line @next/next/no-img-element
              className="mr-2 h-6 w-6 rounded-full"
              src={
                comment.user.image ||
                "https://flowbite.com/docs/images/people/profile-picture-2.jpg"
              }
              alt={comment.user.name}
            />
            {comment.user.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <p>{dayjs(comment.createdAt).format("DD MMMM YYYY")}</p>
          </p>
        </div>
        <button
          id="dropdownComment1Button"
          //   onClick={() => setCommentDropdown(!commentDropdown)}
          className="inline-flex items-center rounded-lg bg-white p-2 text-center text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          type="button"
        >
          <svg
            className="h-4 w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 3"
          >
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
          <span className="sr-only">Comment settings</span>
        </button>
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
      {comment.replies?.map((nestedComment) => (
        <>
          <CommentCard
            comment={nestedComment}
            key={nestedComment.id}
            isReply={true}
          />
        </>
      ))}
    </article>
  );
};

export default CommentCard;
