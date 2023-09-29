/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { Input } from "~/components/shared/ui/Input";
import { Button } from "~/components/shared/ui/Button";
import { Login } from "~/components/app/Login";
import { Signup } from "~/components/app/Signup";
import { signOut, useSession } from "next-auth/react";
import { Avatar } from "@nextui-org/react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { data: sessionData } = useSession();

  console.log(sessionData);

  return (
    <header className="fixed top-0 left-0 z-50 mb-2 flex h-12 w-full flex-row items-center bg-white shadow-md dark:bg-neutral-900 dark:shadow-lg">
      <div className="box-border inline-flex grow flex-row items-center px-5">
        <Link href="/" className="mx-auto w-64 pl-4 align-middle">
          <Image
            src={
              theme === "dark"
                ? "/images/logo-dark.png"
                : "/images/logo-white.png"
            }
            alt="logo"
            width={200}
            height={48}
          />
        </Link>

        <div className="margin mx-auto max-w-2xl  grow">
          <Input placeholder="Search" />
        </div>
        <div className=" margin mx-auto ml-5 inline-flex flex-row items-center gap-2">
          {sessionData && sessionData.user ? (
            <>
              {sessionData?.user.name}

              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Çıkış Yap
              </Button>
            </>
          ) : (
            <>
              <Login />
              <Signup />
            </>
          )}

          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-5 w-5 text-gray-800 dark:text-gray-200"
            >
              {theme === "dark" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              )}
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
