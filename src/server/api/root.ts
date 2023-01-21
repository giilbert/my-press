import { postRouter } from "./routers/post";
import { streamRouter } from "./routers/stream";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  stream: streamRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
