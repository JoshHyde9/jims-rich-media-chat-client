import type { Message } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { sendMessageSchema } from "~/lib/schema";

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
});
