/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import pusher from "@/utils/pusher";
import { api } from "@/utils/api";

export const thoughtsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ 
      title: z.string().trim().max(300).optional(),
      content: z.string().trim().max(Infinity) 
    }))
    .mutation(async ({ctx, input }) => {
      const result = await ctx.prisma.thoughts.create({
        data: {
          title: input?.title,
          content: input?.content,
          userId: ctx.session?.user?.id
        }
      }).catch(err => {
        console.log(err);
      })
      return result
  }),


  delete: protectedProcedure
    .input(z.object({ thoughtId: z.string().trim() }))
    .mutation(async ({ctx, input }) => {
      const result = await ctx.prisma.thoughts.delete({
        where: {
          id: input?.thoughtId
        }
      }).catch(err => {
        console.log(err);
      })
      return result
  }),


  update: protectedProcedure
    .input(z.object({ 
      thoughtId: z.string().trim(), 
      content: z.string().trim().max(Infinity),
      title: z.string().trim().max(300).optional() 
    }))
    .mutation(async ({ctx, input }) => {
      const result = await ctx.prisma.thoughts.update({
        data: {
          title: input?.title,
          content : input?.content
        },
        where: {
          id: input?.thoughtId
        }
      }).catch(err => {
        console.log(err);
      })
      return result
  }),
  
  like: protectedProcedure
    .input(z.object({ thoughtId: z.string().trim() }))
    .mutation(async ({ctx, input }) => {
      const likeExsists = await ctx.prisma.like.findUnique({
        where: {
          userId_thoughtId: {
            thoughtId: input?.thoughtId,
            userId: ctx.session?.user?.id
          }
        },
      });
      const thoughtBy = await ctx?.prisma?.thoughts?.findFirst({
        where: {
          id: input?.thoughtId
        },
        select: {
          userId: true
        }
      });
      if(likeExsists == null){
        await ctx.prisma.like.create({
          data: {
            userId: ctx?.session?.user?.id,
            thoughtId: input?.thoughtId
          }
        }).catch(err => {
          console.log(err);
        })

        if(ctx?.session?.user?.id !== thoughtBy?.userId ){
          await pusher.trigger(thoughtBy?.userId ?? '', "le", {
            type: 'like',
            user: ctx?.session?.user
          });
  
          await ctx.prisma.notification.create ({
            data: {
              type: 'like',
              userId: thoughtBy?.userId ?? '',
              senderId: ctx?.session?.user?.id,
              thoughtId: input?.thoughtId
            }
          }).catch(err => console.log(err));
        }

        return {likeAdded: true}
      }else{
        await ctx.prisma.like.delete({
          where: {
            userId_thoughtId: {
              userId: ctx?.session?.user?.id,
              thoughtId: input?.thoughtId
            }
          }
        }).catch(err => {
          console.log(err);
        })

        const notifId = await ctx.prisma.notification.findFirst({
          where: {
            userId: thoughtBy?.userId ?? '',
            senderId: ctx?.session?.user?.id,
          },
          select: {
            id: true
          }
        });
        if(notifId){
          await ctx.prisma.notification.delete({
            where:{
              id: notifId?.id
            }
          }).catch(err => console.log(err));
  
          await pusher.trigger(thoughtBy?.userId ?? '', "le", {
            type: 'like',
          });
        }
        return {likeAdded: false}
      }
      
  }),


  getAll: publicProcedure
    .input(z.object({ userId: z.string()}))
    .query(async ({ctx, input }) => {
      const result = await ctx.prisma.thoughts.findMany({
        where: {
          userId: input?.userId,
        },
        select: {
          id: true,
          title: true,
          content: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
              createdAt: true
            }
          },
          likes: true,
          comments: true
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


