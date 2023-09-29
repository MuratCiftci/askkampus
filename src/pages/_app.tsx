import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "~/components/shared/ui/Toaster";
import HomeLayout from "~/components/layout/home";
import { ThemeProvider } from "next-themes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NextUIProvider } from "@nextui-org/react";
import dayjs from "dayjs";
require("dayjs/locale/tr");

dayjs.locale("tr");

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <ThemeProvider attribute="class">
          <Toaster />
          <HomeLayout>
            <Component {...pageProps} />
          </HomeLayout>
        </ThemeProvider>
      </NextUIProvider>
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
