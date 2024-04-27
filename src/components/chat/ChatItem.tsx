"use client";
import type z from "zod";
import type { Member, MemberRole } from "@prisma/client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Edit, FileIcon, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "~/trpc/react";
import { useModal } from "~/hooks/useModalStore";

import { cn } from "~/lib/utils";
import { roleIconMap } from "~/lib/iconMaps";
import { editMessageSchema } from "~/lib/schema";

import { ActionTooltip } from "../actionTooltip";
import { UserAvatar } from "../userAvatar";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type ChatItemProps = {
  id: string;
  content: string;
  member: {
    user: {
      id: string;
      name: string;
      image: string;
    };
  } & {
    id: string;
    role: MemberRole;
    nickname: string | null;
    userId: string;
    serverId: string;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
};

export const ChatItem = ({
  id,
  member,
  timestamp,
  content,
  currentMember,
  deleted,
  fileUrl,
  isUpdated,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState("");
  const { onOpen } = useModal();

  const form = useForm({
    resolver: zodResolver(editMessageSchema),
    defaultValues: {
      content,
      messageId: id,
      serverId: member.serverId,
    },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const { mutate: editMessage } = api.message.editMessage.useMutation({
    onMutate: async (data) => {
      setIsEditing(false);

      setNewContent(data.content);
    },
  });

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === "ADMIN";
  const isModerator = currentMember.role === "MODERATOR";
  const isMessageOwner = currentMember.id === member.id;
  const canDeleteMessage =
    !deleted && (isAdmin || isModerator || isMessageOwner);
  const canEditMessage = !deleted && isMessageOwner && !fileUrl;

  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const onEditMessageSubmit = (values: z.infer<typeof editMessageSchema>) => {
    editMessage(values);
  };

  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <div className="cursor-pointer transition hover:drop-shadow-md">
          <UserAvatar src={member.user.image} />
        </div>
        <div className="ml-2 flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="cursor-pointer text-sm font-semibold hover:underline">
                {member.nickname ?? member.user.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              className="relative mt-2 flex h-48 w-48 items-center overflow-hidden rounded-md border bg-secondary"
            >
              <Image
                src={fileUrl}
                alt="content"
                className="object-cover"
                fill
              />
            </a>
          )}
          {isPDF && (
            <div className="relative mt-2 flex items-center rounded-md bg-neutral-300/10 p-2">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "mt-1 text-sm italic text-zinc-500 dark:text-zinc-400",
              )}
            >
              {newContent.length <= 0 ? content : newContent}
              {/* TODO: All messages are displaying edited for some reason? */}
              {isUpdated && !deleted && (
                <span className="mx-2 text-xs italic text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex w-full items-center gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onEditMessageSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            className="border-0 border-none bg-zinc-200/90 p-2 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="mt-1 text-sm text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing((editing) => !editing)}
                className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-300"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() => {
                onOpen("deleteMessage", {
                  messageId: id,
                  serverId: member.serverId,
                });
              }}
              className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
