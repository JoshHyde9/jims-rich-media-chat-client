"use client";

import { type Channel, MemberRole } from "@prisma/client";
import type { ServerWithMembersWithProfiles } from "~/lib/types";

import { useParams, useRouter } from "next/navigation";
import { Edit, Lock, Trash } from "lucide-react";

import { type ModalType, useModal } from "~/hooks/useModalStore";

import { sidebarIconMap } from "~/lib/iconMaps";
import { cn } from "~/lib/utils";

import { ActionTooltip } from "~/components/actionTooltip";

type ServerChannelProps = {
  channel: Channel;
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
};

type ParamsProps = {
  channelId?: string;
  serverId?: string;
};

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const params = useParams<ParamsProps>();
  const router = useRouter();

  const { onOpen } = useModal();

  const Icon = sidebarIconMap[channel.type];

  const onChannelClick = () => {
    router.push(`/server/${params.serverId}/channel/${channel.id}`);
  };

  // Stops onChannelClick from being called when opening Edit/Delete modals
  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <button
      onClick={onChannelClick}
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
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e, "editChannel")}
              className="hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => onAction(e, "deleteChannel")}
              className="hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock className="ml-auto hidden h-4 w-4 text-zinc-500 group-hover:block dark:text-zinc-400" />
      )}
    </button>
  );
};
