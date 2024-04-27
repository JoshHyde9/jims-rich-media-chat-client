import { initialConversationSchema } from "~/lib/schema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const conversationRouter = createTRPCRouter({
  findInitialConversation: protectedProcedure
    .input(initialConversationSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db.conversation.findFirst({
        where: {
          AND: [
            { memberOneId: input.memberOneId, memberTwoId: input.memberTwoId },
          ],
        },
        include: {
          memberOne: {
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
          memberTwo: {
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
        },
      });
    }),
  create: protectedProcedure
    .input(initialConversationSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.conversation.create({
        data: {
          memberOneId: input.memberOneId,
          memberTwoId: input.memberTwoId,
        },
        include: {
          memberOne: {
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
          memberTwo: {
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
        },
      });
    }),
});
