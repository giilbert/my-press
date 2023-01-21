import { streamRouter } from "./routers/stream";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  stream: streamRouter,
});

export type AppRouter = typeof appRouter;
