import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

import { ServerHeader } from "./serverHeader";
import { ServerSearch } from "./ServerSearch";

import { ScrollArea } from "~/components/ui/scroll-area";

import { channelIconMap, memberIconMap } from "~/lib/iconMaps";

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

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  );
  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  );

  const loggedInUserRole = server.members.find(
    (member) => member.userId === session.user.id,
  )?.role;

  return (
    <div className="flex h-full w-full flex-col bg-[#f2f3f5] text-primary dark:bg-[#2b2d31]">
      <ServerHeader server={server} role={loggedInUserRole} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Audio Channels",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: server.members.map((member) => ({
                  id: member.id,
                  name: member.nickname ?? member.user.name,
                  icon: memberIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
