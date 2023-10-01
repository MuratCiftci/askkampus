import React from "react";
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
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getAllPosts"]["posts"][number];
type UserPosts = RouterOutput["user"]["getUserPosts"][number];
type Props = {
  post: Post & UserPosts;
};

const PostCard = (props: Props) => {
  const { post } = props;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

  const [isFavorited, setIsFavorited] = React.useState(
    post.favorites?.length > 0
  );
  const [upvoteCount, setUpvoteCount] = React.useState(post._count?.votes);
  const [isUpvoted, setIsUpvoted] = React.useState(
    !!(post.votes?.length > 0 && post.votes?.[0]?.voteType === "UPVOTE")
  );
  const [isDownvoted, setIsDownvoted] = React.useState(
    !!(post?.votes?.length > 0 && post.votes?.[0]?.voteType === "DOWNVOTE")
  );
  console.log(isDownvoted, isUpvoted, post.votes?.[0]?.voteType, post?.title);

  const utils = api.useContext();
  const upvotePost = api.post.toggleVote.useMutation({
    onSuccess: () => {
      toast({ title: "Oy verildi" });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const addToFavorites = api.user.togglePostToFavorites.useMutation({
    onSuccess: () => {
      toast({ title: isFavorited ? "Favorilerden çıkarıldı" : "Post favorilere eklendi" });
      setIsFavorited(prev => !prev)
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleVoteStatus = (vote: "UPVOTE" | "DOWNVOTE" | "NONE") => {
    let voteChange = 0;

    if (vote === "UPVOTE") {
      voteChange = isUpvoted ? -1 : isDownvoted ? 2 : 1;
      setIsUpvoted(!isUpvoted);
      setIsDownvoted(false);
    } else if (vote === "DOWNVOTE") {
      voteChange = isDownvoted ? 1 : isUpvoted ? -2 : -1;
      setIsDownvoted(!isDownvoted);
      setIsUpvoted(false);
    }

    setUpvoteCount((count) => count + voteChange);
  };

  return (
    <div className="dark:bg-neutral-900 container m-8 mb-8 flex max-w-lg transform flex-col rounded-xl bg-white  p-4 shadow-xl drop-shadow-xl duration-500 transition hover:scale-105 hover:shadow-2xl">
      <div className="flex items-center justify-between pb-4">
        <div className="flex w-10 flex-col items-center justify-center border-l border-transparent   pr-2">
          <div
            className="m-0 cursor-pointer hover:bg-inherit hover:text-blue-500 dark:hover:bg-inherit dark:hover:text-blue-500"
            onClick={() => {
              handleVoteStatus("UPVOTE");
              upvotePost.mutate({ postId: post.id, voteType: "UPVOTE" });
            }}
          >
            {isUpvoted ? <UpvoteFilled /> : <Upvote />}
          </div>

          <span className="m-0 p-0 text-xs font-bold text-gray-500">
            {" "}
            {upvoteCount}{" "}
          </span>

          <div
            onClick={() => {
              handleVoteStatus("DOWNVOTE");
              upvotePost.mutate({ postId: post.id, voteType: "DOWNVOTE" });
            }}
            className="w-24px h-24px cursor-pointer hover:bg-inherit hover:text-orange-500 dark:hover:bg-inherit dark:hover:text-orange-500"
          >
            {isDownvoted ? <DownvoteFilled /> : <Downvote />}
          </div>
        </div>
        <a className="inline-block" href="#">
          <Image
            className="h-14 w-14 max-w-none rounded-full"
            src={post?.community?.image_url || "/images/placeholder-avatar.jpg"}
            alt="Profile image"
            width={56}
            height={56}
          />
        </a>
        <div className="ml-4 flex flex-grow flex-col">
          <div className="flex flex-wrap items-center justify-between">
            <Link
              className="text-slate-900 dark:text-slate-100 mr-2 inline-block text-sm font-bold hover:underline
            
            "
              href={`/community/${post?.communityId || ""}`}
            >
              {post?.community?.name}
            </Link>
            <Link
              className="text-slate-500 dark:text-slate-300 dark:hover:text-slate-200 mx-1 cursor-pointer text-xs hover:underline"
              href={`/user/${post.user?.id || ""}`}
            >
              {" "}
              {post.user?.name} tarafından paylaşıldı{" "}
            </Link>{" "}
          </div>
          <div className="text-slate-500 dark:text-slate-300 flex flex-col items-start text-xs">
            {getTimeDifference(post.createdAt)}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
          <Link href={`/post/${post.id}`}>{post.title}</Link>
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
            href={`/post/${post.id}`}
            className="block flex-1 px-3 py-4 text-center text-sm font-medium text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-900 dark:hover:text-indigo-300"
          >
            <div className="flex items-center justify-center rounded-md px-2 py-1 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900 dark:hover:text-indigo-400">
              <svg
                className="mr-2 h-4 w-4 flex-shrink-0 fill-current"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
              </svg>
              <span> {post._count?.comments} Yorum</span>
            </div>
          </Link>
          <div className="group block flex-1 cursor-pointer px-3 py-4 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-200">
            <div
              className="flex items-center justify-center gap-2"
              onClick={() => addToFavorites.mutate({ id: post.id })}
            >
              {isFavorited ? (
                <Image src={"/images/heart.png"} width={16} height={16} alt="heart" />
              ) : (
                <OutlinedFavorite />
              )}

              <span>
                {" "}
                {isFavorited ? "Favorilerden çıkar" : "Favorilere ekle"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
