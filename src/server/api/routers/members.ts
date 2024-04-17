import { updateMemberRoleSchema } from "~/lib/schema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const membersRouter = createTRPCRouter({
  updateMemberRole: protectedProcedure
    .input(updateMemberRoleSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.server.update({
        where: {
          id: input.serverId,
          userId: ctx.session.user.id,
        },
        data: {
          members: {
            update: {
              where: {
                id: input.memberId,
                userId: {
                  not: ctx.session.user.id,
                },
              },
              data: {
                role: input.role,
              },
            },
          },
        },
        include: {
          members: {
            include: {
              user: true,
            },
            orderBy: {
              role: "asc",
            },
          },
        },
      });
    }),
});
