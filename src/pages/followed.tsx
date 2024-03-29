import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { useToast } from "~/components/hooks/ui/use-toast";
import Posts from "~/components/app/Posts";
import { CardWithLink } from "~/components/app/HomeCard";
import LatestCommunities from "~/components/app/LatestCommunties";
import TopCommunities from "~/components/app/TopCommunities";
import FollowedCommunitiesPosts from "~/components/app/Posts/Followed";

const Home: NextPage = () => {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex items-center justify-center space-x-1 text-sm text-gray-700">
          <svg
            fill="none"
            className="h-6 w-6 animate-spin"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>

          <div>Loading ...</div>
        </div>
      </div>
    );
  }
  if (status === "unauthenticated") {
    void signIn();
  }

  return (
    <>
      <Head>
        <title>Kampusesor</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-row items-start justify-center gap-12">
        <div className="flex min-h-[calc(100vh-48px)] w-7/12 flex-col items-center justify-start overflow-hidden py-2">
          <FollowedCommunitiesPosts />
        </div>
        <div className="flex w-5/12 flex-col items-start justify-start gap-12">
          <CardWithLink />
          <LatestCommunities />
          <TopCommunities />
        </div>
      </div>
    </>
  );
};

export default Home;
