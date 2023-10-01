import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
type Data = {
  name: string;
  id: string;
  createdAt: Date;
  description: string;
  image_url: string;
  _count?: {
    users: number;
  };
};
type Props = {
  data: Data[];
  type: "community_last_added" | "community_most_followed";
};

const CardList = ({ data, type }: Props) => {
  const renderCommunityInfo = (item: Data) => {
    if (type === "community_last_added") {
      return (
        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          {dayjs(item.createdAt).format("DD MMMM YYYY")}
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          {item?._count?.users} Üye
        </div>
      );
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="max-w-md rounded-lg border bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-8">
        <div className="mb-4 flex w-full items-center justify-between gap-12">
          <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            {type === "community_last_added"
              ? "Son Eklenen Topluluklar"
              : "En Popüler Topluluklar"}
          </h3>
          <Link
            href={
              type === "community_last_added"
                ? "/communities?sort=new"
                : "/communities?sort=most-followed"
            }
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Hepsini Gör
          </Link>
        </div>
        <div className="flow-root">
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            {data?.map((item) => (
              <li className="py-3 sm:py-4" key={item.id}>
                <div className="flex items-center space-x-4">
                  <Link href={`/community/${item.id}`}>
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={item.image_url}
                        alt={item.name}
                      />
                    </div>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {item?.description?.length > 50 ? ( // 50 karakterden fazla ise kısalt
                        <p>{item?.description?.slice(0, 50)}...</p>
                      ) : (
                        <p>{item?.description}</p>
                      )}
                    </p>
                  </div>

                  {renderCommunityInfo(item)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CardList;
