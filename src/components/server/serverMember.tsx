"use client";

import type { Member, Server, User } from "@prisma/client";

import { useParams, useRouter } from "next/navigation";

import { cn } from "~/lib/utils";
import { roleIconMap } from "~/lib/iconMaps";
import { UserAvatar } from "../userAvatar";

type ServerMemberProps = {
  member: Member & { user: User };
  server: Server;
};

type ParamsProps = {
  memberId?: string;
  serverId?: string;
};

export const ServerMember = ({ member }: ServerMemberProps) => {
  const params = useParams<ParamsProps>();
  const router = useRouter();

  const onMessageMember = () => {
    router.push(`/server/${params?.serverId}/conversation/${member.id}`);
  };

  return (
    <button
      onClick={onMessageMember}
      className={cn(
        "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <UserAvatar src={member.user.image} className="h-4 w-4 md:h-8 md:w-8" />
      <p
        className={cn(
          "text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {member.nickname
          ? member.nickname.length > 17
            ? member.nickname.substring(0, 17) + "..."
            : member.nickname
          : member.user.name.length > 17
            ? member.user.name.substring(0, 17) + "..."
            : member.user.name}
      </p>
      <div className="ml-auto">{roleIconMap[member.role]}</div>
    </button>
  );
};
