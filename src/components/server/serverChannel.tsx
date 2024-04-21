"use client";

import type { Channel, MemberRole, Server } from "@prisma/client";
import { useRouter, useParams } from "next/navigation";
import { sidebarIconMap } from "~/lib/iconMaps";

import { cn } from "~/lib/utils";

type ServerChannelProps = {
  channel: Channel;
  server: Server;
  role?: MemberRole;
};

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const params = useParams<{ channelId?: string }>();
  const router = useRouter();
  const Icon = sidebarIconMap[channel.type];

  return (
    <button
      onClick={() => {}}
      className={cn(
        "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 hover:dark:bg-zinc-700/50",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 text-xs font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {channel.name}
      </p>
    </button>
  );
};
