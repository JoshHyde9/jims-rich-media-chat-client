import type { Message } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import {
  editMessageSchema,
  getInfiniteMessagesSchema,
  sendMessageSchema,
} from "~/lib/schema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const messageRouter = createTRPCRouter({
  onCreate: protectedProcedure.subscription(({ ctx }) => {
    return observable<Message>((emit) => {
      const onCreate = (data: Message) => {
        emit.next(data);
      };

      ctx.ee.on("createMessage", onCreate);

      return () => {
        ctx.ee.off("createMessage", onCreate);
      };
    });
  }),
  onDeleteMessage: protectedProcedure.subscription(({ ctx }) => {
    return observable<Message>((emit) => {
      const onDelete = (data: Message) => {
        emit.next(data);
      };

      ctx.ee.on("deleteMessage", onDelete);

      return () => {
        ctx.ee.off("deleteMessage", onDelete);
      };
    });
  }),
  create: protectedProcedure
    .input(sendMessageSchema)
    .mutation(async ({ ctx, input }) => {
      const server = await ctx.db.server.findFirst({
        where: {
          id: input.serverId,
          members: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
        include: {
          members: true,
        },
      });

      if (!server) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Server does not exist.",
        });
      }

      const channel = await ctx.db.channel.findFirst({
        where: {
          id: input.channelId,
          serverId: input.serverId,
        },
      });

      if (!channel) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Channel does not exist.",
        });
      }

      const member = server.members.find(
        (member) => member.userId === ctx.session.user.id,
      );
      if (!member) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Server member does not exist.",
        });
      }

      const message = await ctx.db.message.create({
        data: {
          content: input.content,
          fileUrl: input.imageUrl,
          channelId: input.channelId,
          memberId: member.id,
        },
        include: {
          member: {
            include: {
              user: {
                select: {
                  name: true,
                  id: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      const channelKey = `chat:${input.channelId}:messages`;

      ctx.ee.emit(channelKey, message);
      return message;
    }),
  editMessage: protectedProcedure
    .input(editMessageSchema)
    .mutation(async ({ ctx, input }) => {
      const server = await ctx.db.server.findUnique({
        where: { id: input.serverId },
        select: { members: true },
      });

      if (!server) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Server not found.",
        });
      }

      const member = server.members.find(
        (member) => member.userId === ctx.session.user.id,
      );

      if (!member) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Member not found.",
        });
      }

      const message = await ctx.db.message.findUnique({
        where: { id: input.messageId },
        select: {
          member: { select: { userId: true } },
        },
      });

      if (!message) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Message not found.",
        });
      }

      const isMessageOwner = message.member.userId === ctx.session.user.id;
      const isAdmin = member.role === "ADMIN";
      const isModerator = member.role === "MODERATOR";
      const canModify = isMessageOwner || isAdmin || isModerator;

      if (!canModify) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Don't try and be sneaky",
        });
      }

      ctx.ee.emit("deleteMessage", message);

      return await ctx.db.message.update({
        where: {
          id: input.messageId,
        },
        data: {
          content: input.content,
        },
      });
    }),
  deleteMessage: protectedProcedure
    .input(editMessageSchema)
    .mutation(async ({ ctx, input }) => {
      const server = await ctx.db.server.findUnique({
        where: { id: input.serverId },
        select: { members: true },
      });

      if (!server) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Server not found.",
        });
      }

      const member = server.members.find(
        (member) => member.userId === ctx.session.user.id,
      );

      if (!member) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Member not found.",
        });
      }

      const message = await ctx.db.message.findUnique({
        where: { id: input.messageId },
        select: {
          member: { select: { userId: true } },
        },
      });

      if (!message) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Message not found.",
        });
      }

      const isMessageOwner = message.member.userId === ctx.session.user.id;
      const isAdmin = member.role === "ADMIN";
      const isModerator = member.role === "MODERATOR";
      const canDelete = isMessageOwner || isAdmin || isModerator;

      if (!canDelete) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Don't try and be sneaky",
        });
      }

      return await ctx.db.message.update({
        where: {
          id: input.messageId,
        },
        data: {
          content: "This message has been deleted.",
          deleted: true,
          fileUrl: null,
        },
      });
    }),
  infiniteMessage: protectedProcedure
    .input(getInfiniteMessagesSchema)
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.message.findMany({
        take: input.limit,
        skip: 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: { channelId: input.channelId },
        include: {
          member: {
            include: {
              user: {
                select: {
                  name: true,
                  id: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: typeof input.channelId | undefined = undefined;
      if (messages.length > input.limit) {
        const nextMessage = messages.pop();
        nextCursor = nextMessage!.channelId;
      }

      return { messages, nextCursor };
    }),
});
