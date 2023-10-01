import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  tabs: {
    key: string;
    name: string;
    path: string;
    isDefault?: boolean;
  }[];
};

const Tabs = ({ tabs }: Props) => {
  const router = useRouter();
  const { sort } = router.query as { sort: string };
  const checkActive = (tab: string) => {
    if (sort === undefined) {
      return tab === "new";
    }
    return tab === sort;
  };
  return (
    <div className="text-md border-b border-gray-200 text-center font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
      <ul className="-mb-px flex md:flex-wrap">
        {tabs.map((tab) => (
          <li className="mr-2" key={tab.key}>
            <Link
              href={tab.path}
              className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300 ${
                checkActive(tab.key)
                  ? "border-indigo-700 text-indigo-600 dark:text-indigo-400"
                  : ""
              }`}
            >
              {tab.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tabs;
