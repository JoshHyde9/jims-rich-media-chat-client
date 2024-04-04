"use client";

import "~/styles/globals.css";

import { Open_Sans } from "next/font/google";

import { cn } from "~/lib/utils";

import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "next-themes";

const font = Open_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="discord-theme"
          >
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
