import React from "react";
import { type Post } from "./index.type";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
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

const utils = api.useContext();
  const upvotePost = api.post.upvotePost.useMutation({
    onSuccess: async () => {
      await utils.post.getAllPosts.invalidate();

      toast({ title: "Post upvoted" });

    },
  });





    



  return (
    <div className="relative mb-4 min-h-[300px] cursor-pointer rounded-sm border border-gray-300 border-opacity-50 p-2 pl-10 hover:border-opacity-100">
      <div className="absolute left-0 top-0 flex w-10 flex-col items-center justify-center border-l border-transparent py-2 pr-2">
        <div className="flex flex-col items-center  fill-inherit">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-inherit hover:text-blue-500 dark:hover:bg-inherit dark:hover:text-blue-500"
            onClick={() => { upvotePost.mutate({ postId: post.id }) }}
        
        >
            <ArrowBigUp />
          </Button>
          <span className="text-xs font-bold text-gray-500">  {post._count?.votes} </span>

          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-inherit hover:text-orange-500 dark:hover:bg-inherit dark:hover:text-orange-500"
          >
            <ArrowBigDown />
          </Button>
        </div>
      </div>
      <div className="w-full">
        <div className="flex items-center justify-start">
          {post.community && post.community.name && (
            <Link href={`/c/${post.community.name}`}>
              {post.community.name}
            </Link>
          )}
          <span className="mx-1 text-xs font-bold text-gray-500">•</span>
          {post.user && post.user.name && (
            <Link href={`/u/${post.user.name}`}>
              u/{post.user.name}{" "}
              <span className="text-xs  text-gray-500">tarafından</span>
            </Link>
          )}
          <span className="mx-1 text-xs font-bold text-gray-500">•</span>
          <span className="text-xs font-bold text-gray-500">
            {getTimeDifference(post.createdAt)}
          </span>
        </div>

        <div className="mx-4" />
        <Link href={`/p/${post.id}`}>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {post.title}
            </h1>
        </Link>
        <div className="mt-2">
            <Link href={`/p/${post.id}`}>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                    {post.body}
                </p>
            </Link>

            </div>
      </div>
    </div>
  );
};

export default PostCard;
