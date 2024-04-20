"use client";

import Image from "next/image";

import { useSession } from "next-auth/react";
import { ActionTooltip } from "../actionTooltip";
import { useModal } from "~/hooks/useModalStore";

export const UserSettings = () => {
  const { data: session } = useSession();
  const { onOpen } = useModal();

  return (
    <ActionTooltip label="User settings" side="right" align="center">
      <button
        className="flex items-center"
        onClick={() => onOpen("userSettings")}
      >
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
