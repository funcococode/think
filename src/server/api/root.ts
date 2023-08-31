import { createTRPCRouter } from "@/server/api/trpc";
import { registrationRouter } from "@/server/api/routers/registration";
import { thoughtsRouter } from "./routers/thoughts";
import { usersRouter } from "./routers/users";
import { openAiRouter } from "./routers/openai";
import { commentsRouter } from "./routers/comments";
import { notificationRouter } from "./routers/notifications";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  registrationRouter: registrationRouter,
  thoughtsRouter: thoughtsRouter,
  usersRouter: usersRouter,
  openAiRouter: openAiRouter,
  commentsRouter: commentsRouter,
  notificationRouter: notificationRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
