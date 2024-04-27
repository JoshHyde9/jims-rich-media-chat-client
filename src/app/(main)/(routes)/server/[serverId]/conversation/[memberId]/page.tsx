import { redirect } from "next/navigation";
import { ChatHeader } from "~/components/chat/ChatHeader";
import { getOrCreateConversation } from "~/lib/conversation";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

type ConversationPageProps = {
  params: {
    memberId: string;
    serverId: string;
  };
};

export const ConversationPage = async ({ params }: ConversationPageProps) => {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/login");
  }

  const currentMember = await api.members.findByUserAndServerId({
    id: params.serverId,
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation({
    memberOneId: currentMember.id,
    memberTwoId: params.memberId,
  });

  if (!conversation) {
    return redirect(`/server/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.userId === session.user.id ? memberTwo : memberOne;

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        imageUrl={otherMember.user.image}
        name={otherMember.user.name}
        type="conversation"
        serverId={params.serverId}
      />
    </div>
  );
};

export default ConversationPage;
