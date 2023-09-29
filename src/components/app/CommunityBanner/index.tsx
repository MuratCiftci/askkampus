import { Community } from "@prisma/client";
import React from "react";

type Props = {
  community: {
    name: string;
    image_url: string;
  };
};

const CommunityBanner = ({ community }: Props) => {
  return (
    <div className="relative isolate flex items-center justify-start gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {community.image_url && (
          <img
            className="h-16 w-16 flex-shrink-0 rounded-full"
            src={community.image_url}
            alt={community.name}
          />
        )}

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {community.name}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CommunityBanner;
