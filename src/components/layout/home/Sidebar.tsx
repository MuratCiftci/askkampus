import { Home, Users } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Avatar from "~/components/shared/ui/Avatar";
import { api } from "~/utils/api";
type SidebarProps = {
  children: React.ReactNode;
};
const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const [openDropdown, setOpenDropdown] = React.useState(false);
  const { data } = useSession();
  const {
    isLoading,
    data: communities,
    error,
  } = api.community.getCommunityNameAndIdAndImage.useQuery();
  const communityList = communities?.map((community) => {
    return (
      <li
        key={community.id}
        className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
      >
        <Avatar src={community.image_url} size="small" />
        <Link href={`/community/${community.id}`} className="ml-3">
          {community.name}
        </Link>
      </li>
    );
  });
  return (
    <>
      <button
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="mt-2 ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
      >
        <span className="sr-only">Menüyü Aç</span>
        <svg
          className="h-6 w-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-16 left-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-gray-50 px-3 py-16 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href="/"
                className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <Home />
                <span className="ml-3">Anasayfa</span>
              </Link>
            </li>
            <li>
              <Link
                href="/communities"
                className="group flex w-full items-center rounded-lg p-2 text-base text-gray-900 duration-75 transition hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <Users />
                <span className="ml-3 flex-1 whitespace-nowrap text-left">
                  Topluluklar
                </span>
                <div
                  className="flex-shrink-0"
                  onClick={() => setOpenDropdown(!openDropdown)}
                >
                  <svg
                    className="h-3 w-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </div>
              </Link>
              {openDropdown ? (
                <ul id="dropdown-example" className="space-y-2 py-2">
                  {communityList}
                </ul>
              ) : null}
            </li>

            {data?.user ? (
              <li>
                <span
                  onClick={() => void signOut()}
                  className="group flex cursor-pointer items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-gray-500 duration-75 transition group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                    />
                  </svg>
                  <span className="ml-3 flex-1 whitespace-nowrap">
                    Çıkış Yap
                  </span>
                </span>
              </li>
            ) : (
              <li>
                <a
                  href="#"
                  className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-gray-500 duration-75 transition group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                    />
                  </svg>
                  <span
                    onClick={() => void signIn()}
                    className="ml-3 flex-1 whitespace-nowrap"
                  >
                    Giriş Yap
                  </span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </aside>

      <div className="mt-24 px-8 sm:ml-64">
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 dark:border-gray-700">
          {children}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
