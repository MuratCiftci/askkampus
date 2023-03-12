import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "~/components/hooks/ui/use-toast";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

type FormValues = {
  title: string;
  body: string;
};

const Community = () => {
  const router = useRouter();
  const { name } = router.query as { name: string };

  // get community by id

  const { data: community, isLoading } = api.community.getCommunity.useQuery({
    name: name,
  });

  const utils = api.useContext();

  const mutate = api.post.createPost.useMutation({
    onSuccess: async (data) => {
      toast({ title: "Post created", description: "You can now join it" });
      //await router.push(`/${data.communityId}/post/${data.id}`);

      await utils.post.getPostsByCommunity.invalidate({ name: name });
    },

    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const schema = z.object({
    title: z.string().min(3).max(255),
    body: z.string().min(3).max(255),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      body: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const { title, body } = data;

    mutate.mutate({ title, body, community: name });
  };

  const { data: posts, isError } = api.post.getPostsByCommunity.useQuery({
    name: name,
  });

  if (isError) {
    return <div>Error</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("posts", posts);

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" {...register("title")} />
      {errors.title && <p>{errors.title.message}</p>}
      <input type="text" {...register("body")} />
      {errors.body && <p>{errors.body.message}</p>}
      <button type="submit" disabled={mutate.isLoading}>
        Submit
      </button>

      {posts?.map((post) => (
        <Link href={`/${name}/post/${post.id}`} key={post.id}>
          <div className="flex flex-col gap-2 items-center align-center justify-center w-full cursor-pointer">
            <div className="flex flex-row gap-2 align-center border-2 border-gray-200 p-2 rounded-md w-1/4">
              <h1 className="text-2xl font-bold">{post.title}</h1>
              <p className="text-lg">{post.body}</p>
             
            </div>
          </div>
        </Link>
      ))}
    </form>
  );
};

export default Community;
