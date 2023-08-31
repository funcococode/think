/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ 
      thoughtId: z.string().trim(),
      comment: z.string().trim().max(Infinity) 
    }))
    .mutation(async ({ctx, input }) => {
      const result = await ctx.prisma.comment.create({
        data: {
          userId: ctx.session?.user?.id,
          thoughtId: input?.thoughtId,
          comment: input?.comment,
        }
      }).catch(err => {
        console.log(err);
      })
      return result
  }),


  delete: protectedProcedure
    .input(z.object({ commentId: z.string().trim() }))
    .mutation(async ({ctx, input }) => {
      const result = await ctx.prisma.comment.delete({
        where: {
          id: input?.commentId
        }
      }).catch(err => {
        console.log(err);
      })
      return result
  }),


  update: protectedProcedure
    .input(z.object({ 
      commentId: z.string().trim(), 
      comment: z.string().trim().max(Infinity),
    }))
    .mutation(async ({ctx, input }) => {
      const result = await ctx.prisma.comment.update({
        data: {
          comment : input?.comment
        },
        where: {
          id: input?.commentId
        }
      }).catch(err => {
        console.log(err);
      })
      return result
  }),
  
  // like: protectedProcedure
  //   .input(z.object({ thoughtId: z.string().trim() }))
  //   .mutation(async ({ctx, input }) => {
  //     const likeExsists = await ctx.prisma.like.findUnique({
  //       where: {
  //         userId_thoughtId: {
  //           thoughtId: input?.thoughtId,
  //           userId: ctx.session?.user?.id
  //         }
  //       }
  //     })
  //     if(likeExsists == null){
  //       const result = await ctx.prisma.like.create({
  //         data: {
  //           userId: ctx?.session?.user?.id,
  //           thoughtId: input?.thoughtId
  //         }
  //       }).catch(err => {
  //         console.log(err);
  //       })

  //       return {likeAdded: true}
  //     }else{
  //       const result = await ctx.prisma.like.delete({
  //         where: {
  //           userId_thoughtId: {
  //             userId: ctx?.session?.user?.id,
  //             thoughtId: input?.thoughtId
  //           }
  //         }
  //       }).catch(err => {
  //         console.log(err);
  //       })

  //       return {likeAdded: false}
  //     }
      
  // }),

  getAll: publicProcedure
    .input(z.object({ thoughtId: z.string() }))
    .query(async ({ctx, input }) => {
      const result = await ctx.prisma.comment.findMany({
        where: {
          thoughtId: input?.thoughtId,
        },
        select: {
          id: true,
          comment: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          },
        },
        orderBy: {
          createdAt: "desc" 
        }
      }).catch(err => {
        console.log(err);
      });
      return result
  }),
});


