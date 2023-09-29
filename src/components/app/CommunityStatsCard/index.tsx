import { Community } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";
type Props = {
  name: string;
};
const CommunityStatsCard = ({ name }: Props) => {
  const { isLoading, data: community } =
    api.community.getCommunityInfo.useQuery({
      name: name,
    });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-w-3xl mt-12 flex w-1/4 items-start justify-center px-8">
      <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white py-3 shadow-xl">
        <div className="photo-wrapper p-2">
          <img
            className="mx-auto h-32 w-32 rounded-full"
            src={community?.image_url || "/images/placeholder-avatar.jpg"}
            alt={community?.name}
          />
        </div>
        <div className="p-2">
          <h3 className="text-center text-xl font-medium leading-8 text-gray-900">
            {community?.name}
          </h3>
          <div className="text-center text-xs font-semibold text-gray-400">
            <p> {community?.description}</p>
          </div>
          <table className="my-3 text-xs">
            <tbody>
              <tr>
                <td className="px-2 py-2 font-semibold text-gray-500">
                  Toplam Post
                </td>
                <td className="px-2 py-2"> {community?.posts.length}</td>
              </tr>
            </tbody>
          </table>

          <div className="my-3 text-center">
            <Link
              className="text-xs font-medium italic text-indigo-500 hover:text-indigo-600 hover:underline"
              href={`/community/${community?.name || ""}`}
            >
              Topluluğa Git
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityStatsCard;
