"use client";

import { signOut } from "next-auth/react";
import { ModeToggle } from "~/components/ui/ModeToggle";

export default function Home() {
  return (
    <main>
      <h1>Hello World!</h1>
      <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
      <ModeToggle />
    </main>
  );
}
