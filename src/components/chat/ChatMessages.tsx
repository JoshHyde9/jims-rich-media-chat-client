"use client";

import type { Member } from "@prisma/client";

import { Fragment } from "react";
import { format } from "date-fns";

import { api } from "~/trpc/react";

import { ChatWelcome } from "./ChatWelcome";
import { ChatItem } from "./ChatItem";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type ChatMessagesProps = {
  name: string;
  member: Member;
  chatId: string;
  serverId?: string;
  paramValue: string;
  paramKey: string;
  type: "channel" | "conversation";
};

export const ChatMessages = ({
  name,
  type,
  chatId,
  serverId,
  member,
}: ChatMessagesProps) => {
  const { data: messages } = api.message.infiniteMessage.useInfiniteQuery(
    { limit: 10, channelId: chatId, serverId: serverId! },
    { getNextPageParam: (lastMessage) => lastMessage.nextCursor },
  );

  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-4">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="mt-auto flex flex-col-reverse">
        {messages?.pages.map((group, i) => (
          <Fragment key={i}>
            {group.messages.map((message) => (
              <ChatItem
                content={message.content}
                id={message.id}
                member={message.member}
                timestamp={format(message.createdAt, DATE_FORMAT)}
                currentMember={member}
                key={message.id}
                isUpdated={message.createdAt !== message.updatedAt}
                deleted={message.deleted}
                fileUrl={message.fileUrl}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
