import { MemberRole } from "@prisma/client";

import { TRPCError } from "@trpc/server";

import { createChannelSchema, deleteChannelSchema } from "~/lib/schema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const channelRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createChannelSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.serverId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Server id was not passed in.",
        });
      }

      if (input.name.toLowerCase() === "general") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: 'Channel name cannot be "general".',
        });
      }

      // Replace all spaces with "-" and convert to lowercase
      const sanitisedName = input.name.replace(/\s+/g, "-").toLowerCase();

      return await ctx.db.server.update({
        where: {
          id: input.serverId,
          members: {
            some: {
              userId: ctx.session.user.id,
              role: {
                in: [MemberRole.ADMIN, MemberRole.MODERATOR],
              },
            },
          },
        },
        data: {
          channels: {
            create: {
              userId: ctx.session.user.id,
              name: sanitisedName,
              type: input.type,
            },
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(deleteChannelSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.server.update({
        where: {
          id: input.serverId,
          members: {
            some: {
              userId: ctx.session.user.id,
              role: {
                in: [MemberRole.ADMIN, MemberRole.MODERATOR],
              },
            },
          },
        },
        data: {
          channels: {
            delete: {
              id: input.channelId,
              name: {
                not: "general",
              },
            },
          },
        },
      });
    }),
});
