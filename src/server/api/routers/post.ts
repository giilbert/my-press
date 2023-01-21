import { createPostSchema } from "../../../shared/schemas/post";
import { createTRPCRouter, streamAdminProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  create: streamAdminProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.streamPost.create({
        data: {
          streamId: input.streamId,
          authorId: ctx.user.id,
          content: input.content,
          title: input.title,
        },
      });
    }),
});
