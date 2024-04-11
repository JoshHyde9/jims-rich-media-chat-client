import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { ServerHeader } from "./serverHeader";

type ServerSidebarProps = {
  serverId: string;
};

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/");
  }

  const server = await api.server.getMembersAndChannels({
    id: serverId,
  });

  if (!server) {
    return redirect("/");
  }

  const loggedInUserRole = server.members.find(
    (member) => member.userId === session.user.id,
  )?.role;

  return (
    <div className="flex h-full w-full flex-col bg-[#f2f3f5] text-primary dark:bg-[#2b2d31]">
      <ServerHeader server={server} role={loggedInUserRole} />
    </div>
  );
};
