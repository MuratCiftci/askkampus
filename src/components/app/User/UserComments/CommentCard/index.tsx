import React from "react";
import { Comment } from "../../../Comments/index.type";
import { CommentCardProps } from "./index.type";
import dayjs from "dayjs";
import { MessageSquareIcon } from "lucide-react";
import { useRouter } from "next/router";
type Props = {
  comment: CommentCardProps;
};
const CommentCard = ({ comment }: Props) => {
  const router = useRouter();
  return (
    <div className="my-8 flex w-full rounded-xl border border-gray-100 p-4 text-left text-gray-600 shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:text-white sm:p-8">
      <div className="mr-4 flex-shrink-0">
        <MessageSquareIcon />
      </div>
      <div className="w-full text-left">
        <div className="mb-2 flex flex-col justify-between text-gray-600 dark:text-gray-400 sm:flex-row">
          <h5 className="font-xs w-full text-left dark:text-gray-400">
            {" "}
            {comment.post.title.length > 20
              ? comment.post.title.slice(0, 20) + "..."
              : comment.post.title}{" "}
            adlı gönderiye yorum yaptı
          </h5>
          <div className="text-xs">
            {" "}
            {dayjs(comment.createdAt).format("DD MMMM YYYY HH:mm")}{" "}
          </div>
        </div>
        <p className="text-sm">
          {comment.body.length > 100
            ? comment.body.slice(0, 100) + "..."
            : comment.body}
        </p>
        <div className="mt-5 flex items-center justify-between text-gray-600 dark:text-gray-400">
          <button
            onClick={() =>
              void router.push(
                `/post/${comment.post.id || ""}`
              )
            }
            className="cursor-pointer rounded-lg border py-2 px-8 text-center text-xs leading-tight duration-150 ease-in-out transition-colors hover:border-gray-500 hover:bg-gray-100 hover:text-gray-500 dark:hover:border-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-400"
          >
            Reply
          </button>
          {/* <a
            title="Likes"
            href="#"
            className="group flex cursor-pointer items-center justify-around"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 rounded-full p-1 group-hover:bg-red-200 group-hover:text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            12
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
