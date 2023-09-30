import React from "react";
import { api } from "~/utils/api";
import CommunityInfoCard from "../CommunityInfoCard";
import { Button, Input, Typography } from "@material-tailwind/react";
import { TabWithAnimation } from "~/components/shared/ui/TabWithAnimation";
import { useRouter } from "next/router";

const AllCommunities = () => {
  const router = useRouter();
  const sort = router.query.sort as "new" | "most-followed" | "most-posted";

  const [activeTab, setActiveTab] = React.useState(sort || "new");
  const [searchText, setSearchText] = React.useState("");
  const [search, setSearch] = React.useState("");
  const {
    isLoading,
    isError,
    data: communities,
  } = api.community.getAllCommunities.useQuery({
    search: search,
    sort: sort || "new",
  });

  const data = [
    {
      label: "En Yeni",
      value: "new",
      path: "/communities?sort=new",
    },
    {
      label: "En Çok Takip edilenler",
      value: "most-followed",
      path: "/communities?sort=most-followed",
    },
    {
      label: "En Aktifler",
      value: "most-commented",
      path: "/communities?sort=most-posted",
    },
  ];

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchText);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Typography variant="h2">Topluluklar</Typography>
      <div className="my-4 flex w-1/2 flex-col justify-center">
        <TabWithAnimation
          data={data}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <form
          className="relative mx-auto flex w-full max-w-[24rem] my-4"
          onSubmit={handleSearch}
        >
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="simple-search"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="ml-2 rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
        </form>
      </div>
      {isLoading ? (
        <p>Yükleniyor...</p>
      ) : isError ? (
        <p>Hata oluştu</p>
      ) : (
        communities.map((community) => {
          return <CommunityInfoCard key={community.id} community={community} />;
        })
      )}
    </div>
  );
};

export default AllCommunities;
