import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "~/components/shared/ui/Toaster";
import HomeLayout from "~/components/layout/home";
import { ThemeProvider } from "next-themes";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class">
        <Toaster />
        <HomeLayout>
          <Component {...pageProps} />
        </HomeLayout>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
