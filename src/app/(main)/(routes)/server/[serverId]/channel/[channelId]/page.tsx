import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

import { ChatHeader } from "~/components/chat/ChatHeader";

type ChannelPageProps = {
  params: {
    serverId: string;
    channelId: string;
  };
};

export const ChannelPage = async ({ params }: ChannelPageProps) => {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/login");
  }

  const channel = await api.channel.findById({ id: params.channelId });

  const member = await api.members.findByUserAndServerId({
    id: params.serverId,
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
    </div>
  );
};

export default ChannelPage;
