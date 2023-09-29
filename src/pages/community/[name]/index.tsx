import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "~/components/hooks/ui/use-toast";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import PostCard from "~/components/app/PostCard";
import CommunityStatsCard from "~/components/app/CommunityStatsCard";
import CommunityBanner from "~/components/app/CommunityBanner";
import NoFound from "~/components/app/NoFound";

type FormValues = {
  title: string;
  description: string;
};

const Community = () => {
  const router = useRouter();
  const { name } = router.query as { name: string };

  const utils = api.useContext();

  // const mutate = api.post.createPost.useMutation({
  //   onSuccess: async (data) => {
  //     toast({ title: "Post created", description: "You can now join it" });
  //     //await router.push(`/${data.communityId}/post/${data.id}`);

  //     await utils.post.getPostsByCommunity.invalidate({ name: name });
  //   },

  //   onError: (err) => {
  //     toast({
  //       title: "Error",
  //       description: err.message,
  //       variant: "destructive",
  //     });
  //   },
  // });

  // const schema = z.object({
  //   title: z.string().min(3).max(255),
  //   body: z.string().min(3).max(255),
  // });

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<FormValues>({
  //   defaultValues: {
  //     title: "",
  //     body: "",
  //   },
  //   resolver: zodResolver(schema),
  // });

  // const onSubmit: SubmitHandler<FormValues> = (data) => {
  //   const { title, description } = data;

  //   mutate.mutate({ title,  description: description,
  // };

  const { data: posts, isError } = api.post.getPostsByCommunity.useQuery({
    name: name,
  });

  const { data: community, isLoading } =
    api.community.getCommunityInfo.useQuery({
      name: name,
    });

  if (isError) {
    return <div>Error</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const communityBanner = {
    name: community?.name || "",
    image_url: community?.image_url || "",
  };

  return (
    <div className="h-full w-full">
      <CommunityBanner community={communityBanner} />
      <div className=" flex flex-row items-start justify-start">
        <div className=" container flex flex-col items-start justify-start">
          {posts?.length === 0 ? (
            <NoFound />
          ) : (
            posts?.map((post) => (
              <Link href={`/${name}/post/${post.id}`} key={post.id}>
                <div className="align-center flex w-full cursor-pointer flex-col items-center justify-center gap-2">
                  <PostCard post={post} />
                </div>
              </Link>
            ))
          )}
        </div>
        <CommunityStatsCard name={name} />
      </div>
    </div>
  );
};

export default Community;
