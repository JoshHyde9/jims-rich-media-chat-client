import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import {
  createNewServerSchema,
  idSchema,
  inviteCodeSchema,
  updateServerSettingsSchema,
} from "~/lib/schema";

export const serverRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createNewServerSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.server.create({
        data: {
          userId: ctx.session.user.id,
          name: input.name,
          image: input.imageUrl,
          inviteCode: uuidv4(),
          channels: {
            create: [{ name: "general", userId: ctx.session.user.id }],
          },
          members: {
            create: [{ userId: ctx.session.user.id, role: MemberRole.ADMIN }],
          },
        },
        select: { id: true },
      });
    }),
  getUserServers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.server.findMany({
      where: {
        members: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
    });
  }),
  getById: protectedProcedure.input(idSchema).query(async ({ ctx, input }) => {
    return await ctx.db.server.findUnique({
      where: {
        id: input.id,
        members: { some: { userId: ctx.session.user.id } },
      },
    });
  }),
  getMembersAndChannels: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db.server.findUnique({
        where: {
          id: input.id,
          members: { some: { userId: ctx.session.user.id } },
        },
        include: {
          channels: { orderBy: { createdAt: "asc" } },
          members: { include: { user: true }, orderBy: { role: "asc" } },
        },
      });
    }),
  newInviteCode: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.server.update({
        where: {
          id: input.id,
        },
        data: {
          inviteCode: uuidv4(),
        },
        select: {
          inviteCode: true,
        },
      });
    }),
  getServerByInviteCode: protectedProcedure
    .input(inviteCodeSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db.server.findFirst({
        where: {
          inviteCode: input.inviteCode,
          members: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
    }),
  addNewMember: protectedProcedure
    .input(inviteCodeSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.server.update({
        where: {
          inviteCode: input.inviteCode,
        },
        data: {
          members: {
            create: [{ userId: ctx.session.user.id }],
          },
        },
      });
    }),
  updateServerSettings: protectedProcedure
    .input(updateServerSettingsSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.server.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          name: input.name,
          image: input.imageUrl,
        },
      });
    }),
  leave: protectedProcedure.input(idSchema).mutation(async ({ ctx, input }) => {
    return await ctx.db.server.update({
      where: {
        id: input.id,
        userId: {
          not: ctx.session.user.id,
        },
        members: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            userId: ctx.session.user.id,
          },
        },
      },
    });
  }),
});
