import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "~/components/hooks/ui/use-toast";
import { Button } from "~/components/shared/ui/Button";
import { api } from "~/utils/api";
type Props = {
  community: {
    name: string;
    id: string;
    createdAt: Date;
    description: string;
    image_url: string;
    _count: {
      posts: number;
      users: number;
      events: number;
    };
  };
};

const CommunityInfoCard = ({ community }: Props) => {
  const utils = api.useContext();

  return (
    <>
      <div className="relative mx-auto mt-6 mb-6 mt-16 w-full min-w-0 max-w-md break-words rounded-xl bg-white shadow-lg md:max-w-2xl">
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="flex w-full justify-center">
              <div className="relative">
                <Image
                  alt="logo"
                  width={150}
                  height={150}
                  src={community?.image_url || "/images/placeholder-avatar.jpg"}
                  className="absolute -m-16 -ml-20 max-w-[150px] rounded-full border-none align-middle shadow-xl lg:-ml-16"
                />
              </div>
            </div>
            <div className="mt-20 w-full text-center">
              <div className="flex justify-center pt-8 pb-0 lg:pt-4">
                <div className="p-3 text-center">
                  <span className="text-slate-700 block text-xl font-bold uppercase tracking-wide">
                    {community?._count.posts}
                  </span>
                  <span className="text-slate-400 text-sm">Post</span>
                </div>
                <div className="p-3 text-center">
                  <span className="text-slate-700 block text-xl font-bold uppercase tracking-wide">
                    {community?._count.users}
                  </span>
                  <span className="text-slate-400 text-sm"> Takipçi</span>
                </div>

                <div className="p-3 text-center">
                  <span className="text-slate-700 block text-xl font-bold uppercase tracking-wide">
                    {community?._count.events}
                  </span>
                  <span className="text-slate-400 text-sm">Etkinlik</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-slate-700 mb-1 text-2xl font-bold leading-normal">
              {community?.name.length > 30
                ? community?.name.slice(0, 20) + "..."
                : community?.name}
            </h3>
          </div>
          <div className="border-slate-200 mt-6 border-t py-6 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4">
                <p className="text-slate-600 mb-4 font-light leading-relaxed">
                  {community?.description}
                </p>
                <Link
                  href={`/community/${community?.id}`}
                  className="text-slate-700 hover:text-slate-400 font-normal"
                >
                   Topluluğa Git
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <footer className="relative mt-6 pt-6 pb-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center md:justify-between">
            <div className="mx-auto w-full px-4 text-center md:w-6/12"></div>
          </div>
        </div>
      </footer> */}
    </>
  );
};

export default CommunityInfoCard;
