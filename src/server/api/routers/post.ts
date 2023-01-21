import { Permission } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createPostSchema } from "../../../shared/schemas/post";
import {
  createTRPCRouter,
  enforceStreamMember,
  protectedProcedure,
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

  listAll: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const TAKE = 25;

      const posts = await ctx.prisma.streamPost.findMany({
        // probably slow dooo doo doo doooo..
        where: {
          stream: {
            members: {
              some: {
                userId: ctx.user.id,
                permission: Permission.MEMBER,
              },
            },
          },
        },
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

  updateStatus: protectedProcedure
    .input(
      z.object({
        notes: z.string(),
        completed: z.boolean(),
        postId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // check that the user has access to the post
      const post = await ctx.prisma.streamPost.findUnique({
        where: { id: input.postId },
        include: { stream: true },
      });

      if (!post)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Message not found.",
        });

      await enforceStreamMember(ctx.prisma, ctx.user.id, post.streamId);

      await ctx.prisma.streamPostOnUser.upsert({
        where: {
          userId_postId: {
            userId: ctx.user.id,
            postId: input.postId,
          },
        },
        create: {
          notes: input.notes,
          completed: input.completed,
          postId: input.postId,
          userId: ctx.user.id,
        },
        update: {
          notes: input.notes,
          completed: input.completed,
        },
      });
    }),
});
