import React from "react";
import { type Post } from "./index.type";
import { ArrowBigDown, ArrowBigUp, ArrowUp } from "lucide-react";
import { Button } from "~/components/shared/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { getTimeDifference } from "./functions/getTimeDifference";
import { api } from "~/utils/api";
import { toast } from "~/components/hooks/ui/use-toast";
import OutlinedFavorite from "~/components/shared/icons/OutlinedFavorite";
import Upvote from "~/components/shared/icons/Upvote";
import Downvote from "~/components/shared/icons/Downvote";
import UpvoteFilled from "~/components/shared/icons/UpvoteFilled";
import DownvoteFilled from "~/components/shared/icons/DownvoteFilled";

type Props = {
  post: Post;
};

const PostCard = (props: Props) => {
  const { post } = props;

  const [upvoteCount, setUpvoteCount] = React.useState(post._count?.votes);
  const [isUpvoted, setIsUpvoted] = React.useState(false);
  const [isDownvoted, setIsDownvoted] = React.useState(false);

  const utils = api.useContext();
  const upvotePost = api.post.upvotePost.useMutation({
    onSuccess: () => {
      setUpvoteCount((upvoteCount) =>  (upvoteCount ? upvoteCount + 1 : 1));

      toast({ title: "Post upvoted" });
    },
    onError: (err) => {
      setIsUpvoted(false);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container m-8 mb-8 flex max-w-lg transform flex-col rounded-xl bg-white p-4 shadow-lg duration-500 transition hover:scale-105 hover:shadow-2xl dark:bg-neutral-900">
      <div className="flex items-center justify-between pb-4">
        <div className="flex w-10 flex-col items-center justify-center border-l border-transparent   pr-2">
          <div
            className="m-0 cursor-pointer hover:bg-inherit hover:text-blue-500 dark:hover:bg-inherit dark:hover:text-blue-500"
            onClick={() => {
              setIsUpvoted(true);
              upvotePost.mutate({ postId: post.id });
            }}
          >
            {isUpvoted ? <UpvoteFilled /> : <Upvote />}
          </div>

          <span className="m-0 p-0 text-xs font-bold text-gray-500">
            {" "}
            {upvoteCount}{" "}
          </span>

          <div className="w-24px h-24px cursor-pointer hover:bg-inherit hover:text-orange-500 dark:hover:bg-inherit dark:hover:text-orange-500">
            {isDownvoted ? <DownvoteFilled /> : <Downvote />}
          </div>
        </div>
        <a className="inline-block" href="#">
          <Image
            className="h-14 w-14 max-w-none rounded-full"
            src={post.community.image_url || "/images/placeholder-avatar.jpg"}
            alt="Profile image"
            width={56}
            height={56}
          />
        </a>
        <div className="ml-4 flex flex-grow flex-col">
          <div className="flex flex-wrap items-center justify-between">
            <Link
              className="mr-2 inline-block text-sm font-bold text-slate-900 hover:underline dark:text-slate-100
            
            "
              href={`/${post.community.name}`}
            >
              {post.community.name}
            </Link>
            <span className="mx-1 cursor-pointer text-xs text-slate-500 hover:underline dark:text-slate-300 dark:hover:text-slate-200">
              {" "}
              {post.user.name} tarafından paylaşıldı{" "}
            </span>{" "}
          </div>
          <div className="flex flex-col items-start text-xs text-slate-500 dark:text-slate-300">
            {getTimeDifference(post.createdAt)}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h5 className="text-blue-gray-900 mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal antialiased">
          <Link href={`${post.community.name}/post/${post.id}`}>
            {post.title}
          </Link>
        </h5>
        <div className="py-4">
          {post.image_url && (
            <div className="relative h-48">
              <Image
                className="rounded-xl object-contain"
                src={post.image_url}
                alt="Post image"
                layout="fill"
              />
            </div>
          )}
        </div>
        <p className="block text-base font-normal leading-relaxed text-gray-700 antialiased">
          {typeof post.body === "string" && post.body.length > 200
            ? post.body.slice(0, 200) + "..."
            : post.body}
        </p>
      </div>
      <div className="mt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="divide-gray-200r flex divide-x divide-gray-200 dark:divide-gray-700 ">
          <Link
            href={`${post.community.name}/post/${post.id}`}
            className="block flex-1 px-3 py-4 text-center text-sm font-medium text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-900 dark:hover:text-indigo-300"
          >
            <div className="flex items-center justify-center rounded-md px-2 py-1 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900 dark:hover:text-indigo-400">
              <svg
                className="mr-2 h-4 w-4 flex-shrink-0 fill-current"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
              </svg>
              <span>Yorum yap</span>
            </div>
          </Link>
          <div className="group block flex-1 cursor-pointer px-3 py-4 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-200">
            <div className="flex items-center justify-center gap-2">
              <OutlinedFavorite />
              <span>Favoriye Ekle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
