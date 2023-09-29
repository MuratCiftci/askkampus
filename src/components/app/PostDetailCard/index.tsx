import React from "react";
import { ArrowBigDown, ArrowBigUp, ArrowUp } from "lucide-react";
import { Button } from "~/components/shared/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import { toast } from "~/components/hooks/ui/use-toast";
import OutlinedFavorite from "~/components/shared/icons/OutlinedFavorite";
import Upvote from "~/components/shared/icons/Upvote";
import Downvote from "~/components/shared/icons/Downvote";
import UpvoteFilled from "~/components/shared/icons/UpvoteFilled";
import DownvoteFilled from "~/components/shared/icons/DownvoteFilled";
import { Post } from "../PostCard/index.type";
import { getTimeDifference } from "../PostCard/functions/getTimeDifference";

type Props = {
  post: Post;
};

const PostDetailCard = (props: Props) => {
  const { post } = props;

  const [upvoteCount, setUpvoteCount] = React.useState(post._count?.votes);
  const [isUpvoted, setIsUpvoted] = React.useState(false);
  const [isDownvoted, setIsDownvoted] = React.useState(false);

  const utils = api.useContext();
  const upvotePost = api.post.upvotePost.useMutation({
    onSuccess: () => {
      setUpvoteCount((upvoteCount) => (upvoteCount ? upvoteCount + 1 : 1));

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
    <div className="container flex transform flex-col rounded-sm bg-white p-4 shadow-md duration-500 transition hover:shadow-2xl dark:bg-neutral-900">
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

          <span className="m-0 p-0 text-xs font-bold text-gray-500 dark:text-gray-300">
            {" "}
            {upvoteCount}{" "}
          </span>

          <div className="w-24px h-24px cursor-pointer hover:bg-inherit hover:text-orange-500 dark:hover:bg-inherit dark:hover:text-orange-500">
            {isDownvoted ? <DownvoteFilled /> : <Downvote />}
          </div>
        </div>
        <div className="align-start flex flex-grow flex-col justify-center pl-2">
          <div className="flex flex-grow flex-row items-center justify-between">
            <div className="flex flex-wrap items-center justify-between">
              <span className="mx-1 cursor-pointer text-xs text-slate-500 hover:underline dark:text-slate-300 dark:hover:text-slate-200">
                {" "}
                {post.user?.name} tarafından paylaşıldı{" "}
              </span>{" "}
            </div>
            <div className="flex flex-col items-start text-xs text-slate-500 dark:text-slate-300">
              {getTimeDifference(post.createdAt)}
            </div>
          </div>
          <h5 className="text-blue-gray-900 mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal antialiased dark:text-white">
            <Link href={`/post/${post.id}`}>
              {post.title}
            </Link>
          </h5>
        </div>
      </div>

      <div className="p-4">
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
        <p className="block text-base font-normal leading-relaxed text-gray-700 antialiased dark:text-gray-200">
          {typeof post.body === "string" && post.body.length > 200
            ? post.body.slice(0, 200) + "..."
            : post.body}
        </p>
      </div>
    </div>
  );
};

export default PostDetailCard;
