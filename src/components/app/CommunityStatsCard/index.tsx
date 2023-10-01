import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { toast } from "~/components/hooks/ui/use-toast";
import { Button } from "~/components/shared/ui/Button";
import { api } from "~/utils/api";
type Props = {
  id: string;
};
const CommunityStatsCard = ({ id }: Props) => {
  const utils = api.useContext();
  const { status } = useSession();
  const { isLoading, data: community } =
    api.community.getCommunityInfo.useQuery({
      id: id,
    });

  const mutateJoin = api.user.joinCommunity.useMutation({
    onSuccess: async () => {
      toast({
        title: "Topluluğa katıldın",
      });
      // invalidate the query
      await utils.community.getCommunityInfo.invalidate({ id: id });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const mutateLeave = api.user.leaveCommunity.useMutation({
    onSuccess: async () => {
      toast({
        title: "Topluluktan ayrıldın",
      });
      // invalidate the query
      await utils.community.getCommunityInfo.invalidate({ id: id });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleJoin = async () => {
    await mutateJoin.mutateAsync({ id: id });
  };
  const handleLeave = async () => {
    await mutateLeave.mutateAsync({ id: id });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-w-3xl mt-12 flex sm:w-full md:w-1/4 items-start justify-center px-8">
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
                <td className="px-2 py-2"> {community?._count.posts}</td>
              </tr>
              <tr>
                <td className="px-2 py-2 font-semibold text-gray-500">
                  Toplam Üye
                </td>
                <td className="px-2 py-2"> {community?._count.users}</td>
              </tr>
            </tbody>
          </table>

          <div className="my-3 text-center">
            <Link
              className="text-xs font-medium italic text-indigo-500 hover:text-indigo-600 hover:underline"
              href={`/community/${community?.id || ""}`}
            >
              Topluluğa Git
            </Link>

            {status === "authenticated" &&
              (community?.users.length === 0 ? (
                <Button
                  onClick={() => void handleJoin()}
                  className="text-xs font-medium italic text-indigo-500 hover:text-indigo-600 hover:underline"
                >
                  Topluluğa Katıl
                </Button>
              ) : (
                <Button
                  onClick={() => void handleLeave()}
                  className="text-xs font-medium italic text-indigo-500 hover:text-indigo-600 hover:underline"
                >
                  Topluluktan Ayrıl
                </Button>
              ))}
            {status === "authenticated" && (
              <Link
                href="/create/event"
                className="text-xs font-medium italic text-indigo-500 hover:text-indigo-600 hover:underline"
              >
                Etkinlik Oluştur
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityStatsCard;
