"use client";

import Image from "next/image";

import { useSession } from "next-auth/react";
import { ActionTooltip } from "../actionTooltip";

export const UserSettings = () => {
  const { data: session } = useSession();

  return (
    <ActionTooltip label="User settings" side="right" align="center">
      <button className="flex items-center">
        {session ? (
          <Image
            src={session.user.image!}
            alt="profile"
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <Image src="" alt="loading" />
        )}
      </button>
    </ActionTooltip>
  );
};
