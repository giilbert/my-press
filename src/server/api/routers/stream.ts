import { Permission } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createStreamSchema } from "../../../shared/schemas/stream";
import {
  createTRPCRouter,
  protectedProcedure,
  streamMemberProcedure,
} from "../trpc";

export const streamRouter = createTRPCRouter({
  getStreamBySlug: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const streamMember = await ctx.prisma.streamMember.findFirst({
        where: {
          userId: ctx.user.id,
          stream: {
            slug: input.slug,
          },
        },
        include: {
          stream: true,
        },
      });

      if (!streamMember)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Stream not found.",
        });

      return {
        ...streamMember.stream,
        permission: streamMember.permission,
      };
    }),

  getJoinedStreams: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.stream.findMany({
      where: {
        members: {
          some: {
            userId: ctx.user.id,
          },
        },
      },
    });
  }),

  create: protectedProcedure
    .input(createStreamSchema)
    .mutation(async ({ ctx, input }) => {
      // check that a stream with that slug does not already exist
      const streamWithSlug = await ctx.prisma.stream.findUnique({
        where: { slug: input.slug },
      });
      if (streamWithSlug)
        throw new TRPCError({
          code: "CONFLICT",
          message: "A stream with that slug already exists.",
        });

      await ctx.prisma.stream.create({
        data: {
          name: input.name,
          slug: input.slug,
          members: {
            create: {
              userId: ctx.user.id,
              permission: Permission.OWNER,
            },
          },
        },
      });
    }),

  subscribe: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.streamMember.create({
        data: {
          permission: Permission.MEMBER,
          user: {
            connect: {
              id: ctx.user.id,
            },
          },
          stream: {
            connect: {
              slug: input.slug,
            },
          },
        },
      });
    }),

  unsubscribe: streamMemberProcedure.mutation(async ({ ctx, input }) => {
    if (ctx.member.permission !== "MEMBER")
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only members can unsubscribe.",
      });

    await ctx.prisma.streamMember.delete({
      where: {
        userId_streamId: {
          userId: ctx.user.id,
          streamId: input.streamId,
        },
      },
    });
  }),
});
