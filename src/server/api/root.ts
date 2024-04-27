import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

import { membersRouter } from "./routers/members";
import { serverRouter } from "./routers/server";
import { channelRouter } from "./routers/channel";
import { conversationRouter } from "./routers/conversation";
import { messageRouter } from "./routers/message";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  members: membersRouter,
  server: serverRouter,
  channel: channelRouter,
  conversation: conversationRouter,
  message: messageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
