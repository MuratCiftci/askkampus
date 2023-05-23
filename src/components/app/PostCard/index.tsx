import React from "react";
import { type Post } from "./index.type";
import { ArrowBigDown, ArrowBigUp, ArrowUp } from "lucide-react";
import { Button } from "~/components/shared/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { getTimeDifference } from "./functions/getTimeDifference";
import { api } from "~/utils/api";
import { toast } from "~/components/hooks/ui/use-toast";

type Props = {
  post: Post;
};

const PostCard = (props: Props) => {
  const { post } = props;

  const [upvoteCount, setUpvoteCount] = React.useState(post._count?.votes);

  const utils = api.useContext();
  const upvotePost = api.post.upvotePost.useMutation({
    onSuccess: () => {
      setUpvoteCount((upvoteCount) => upvoteCount + 1);

      toast({ title: "Post upvoted" });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <article className="break-inside mb-4 flex flex-col rounded-xl bg-white  bg-clip-border p-4 dark:bg-slate-800 dark:bg-opacity-10">
      <div className="flex items-center justify-between pb-4">
        <div className="flex w-10 flex-col items-center justify-center border-l border-transparent   pr-2">
          <ArrowBigUp
            size={20}
            strokeWidth={2.4}
            className="m-0 cursor-pointer hover:bg-inherit hover:text-blue-500 dark:hover:bg-inherit dark:hover:text-blue-500"
            onClick={() => {
              upvotePost.mutate({ postId: post.id });
            }}
          />

          <span className="m-0 p-0 text-xs font-bold text-gray-500">
            {" "}
            {upvoteCount}{" "}
          </span>

          <ArrowBigDown
            size={20}
            strokeWidth={2.4}
            className="w-24px h-24px cursor-pointer hover:bg-inherit hover:text-orange-500 dark:hover:bg-inherit dark:hover:text-orange-500"
          />
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
            <a className="mr-2 inline-block text-sm font-bold" href="#">
              /{post.community.name}
            </a>
            <span className="mx-1 text-xs text-slate-500 dark:text-slate-300">
              {" "}
              Posted by {post.user.name}
            </span>{" "}
          </div>
          <div className="flex flex-col items-start text-xs text-slate-500 dark:text-slate-300">
            {getTimeDifference(post.createdAt)}
          </div>
        </div>
      </div>
      <h2 className="text-lg font-bold   tracking-tight text-slate-900 dark:text-slate-100">
        <Link href={`/post/${post.id}`}>{post.title}</Link>
      </h2>
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
      <p>
        {typeof post.body === "string" && post.body.length > 200
          ? post.body.slice(0, 200) + "..."
          : post.body}
      </p>
    </article>
  );
};

export default PostCard;
