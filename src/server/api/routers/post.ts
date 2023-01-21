import { z } from "zod";
import { createTRPCRouter, streamAdminProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  create: streamAdminProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.streamPost.create({
        data: {
          streamId: input.streamId,
          authorId: ctx.user.id,
          content: input.content,
        },
      });
    }),
});
