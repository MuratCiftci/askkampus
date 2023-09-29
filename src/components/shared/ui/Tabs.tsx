import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  tabs: {
    key: string;
    name: string;
    path: string;
  }[];
};

const Tabs = ({ tabs }: Props) => {
  const router = useRouter();
  const { type } = router.query as { type: string };
  console.log(type);
  return (
    <div className="border-b border-gray-200 text-center text-md font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
      <ul className="-mb-px flex flex-wrap">
        {tabs.map((tab) => (
          <li className="mr-2" key={tab.key}>
            <Link
              href={tab.path}
              className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300 ${
                tab.key === type
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
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
