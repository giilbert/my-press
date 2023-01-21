import { z } from "zod";
import { createPostSchema } from "../../../shared/schemas/post";
import {
  createTRPCRouter,
  streamAdminProcedure,
  streamMemberProcedure,
} from "../trpc";

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

  listOfStream: streamMemberProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const TAKE = 25;

      const posts = await ctx.prisma.streamPost.findMany({
        where: { streamId: input.streamId },
        include: {
          // metadata about completion, notes, etc..
          userStatus: {
            where: {
              userId: ctx.user.id,
            },
          },
        },
        cursor: input.cursor
          ? {
              id: input.cursor,
            }
          : undefined,
        take: TAKE + 1,
      });

      let nextCursor: string | undefined = undefined;
      if (posts.length > TAKE) {
        const nextItem = posts.pop();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextCursor = nextItem!.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),
});
