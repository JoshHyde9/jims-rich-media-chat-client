import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { createNewServerSchema } from "~/lib/types";

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
});
