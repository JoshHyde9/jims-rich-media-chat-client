import { api } from "~/trpc/server";

type getOrCreateConversationProps = {
  memberOneId: string;
  memberTwoId: string;
};

export const getOrCreateConversation = async ({
  memberOneId,
  memberTwoId,
}: getOrCreateConversationProps) => {
  let conversation =
    (await api.conversation.findInitialConversation({
      memberOneId,
      memberTwoId,
    })) ??
    (await api.conversation.findInitialConversation({
      memberOneId: memberTwoId,
      memberTwoId: memberOneId,
    }));

  if (!conversation) {
    conversation = await api.conversation.create({ memberOneId, memberTwoId });
  }

  return conversation;
};
