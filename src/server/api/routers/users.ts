/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import moment from "moment";
import pusher from "@/utils/pusher";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";

export const usersRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ userId: z.string().trim(), from: z.string().optional(), to: z.string().optional()}))
    .query(async ({ctx, input }) => {
      const result = await ctx.prisma.user.findUnique({
        where: {
          id:input?.userId
        },
        select:{
          name: true,
          id: true,
          email: true,
          image: true,
          createdAt: true,
          thoughts: {
            where: {
              createdAt:{
                gte: input?.from && new Date(moment(input?.from).format('YYYY-MM-DD')),
                lt: input?.to ? new Date(moment(input?.to).add(1,'days').format('YYYY-MM-DD')) : new Date(moment(input?.from).add(1,'days').format('YYYY-MM-DD'))
              }
            },
            select:{
              id: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                }
              },
              title: true,
              content: true,
              updatedAt: true,
              likes: true,
              comments: true
            },
            orderBy:{
              createdAt:'desc'
            }
          },
          likes: true,
          follows:{
            select: {
              id: true,
              email: true,
              name: true,
              image: true
            }
          },
          followers: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true
            }
          },
          _count: {
            select: {
              thoughts: true,
              followers: true,
              follows: true
            }
          }
        }
      }).catch(err => {
        console.log(err);
      })
      
      if(!result) return null;
      return {
        ...result,
        isMine: ctx?.session?.user?.id === input?.userId,
        isFollowed:  result?.followers?.findIndex(item => item?.id === ctx?.session?.user?.id) !== -1
      };
  }),

  find: protectedProcedure
    .input(z.object({ query: z.string().trim()}))
    .query(async ({ctx, input }) => {
      const result = await ctx.prisma.user.findMany({
        where: {
          name:{
            startsWith: input?.query
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          _count: {
            select: {
              followers: true,
              follows: true,
              thoughts: true
            }
          }
        },
        take: 10
      }).catch(err => {
        console.log(err);
      })
      return result
  }),
  
  follow: protectedProcedure
    .input(z.object({ userId: z.string().trim() }))
    .mutation(async ({ctx, input }) => {
      const followExists = await ctx.prisma.user.findFirst({
        where: {
          id: ctx?.session?.user?.id,
          follows: {
            some: {
              id: input?.userId
            }
          }
        }
      })
      if(followExists == null){
        await ctx.prisma.user.update({
          where : {
            id: ctx?.session?.user?.id
          },
          data: {
            follows: {
              connect:{
                id: input?.userId
              }
            }
          }
        }).catch(err => {
          console.log(err);
        })

        await ctx.prisma.notification.create ({
          data: {
            type: 'follow',
            userId: input?.userId,
            senderId: ctx?.session?.user?.id
          }
        }).catch(err => console.log(err));

        await pusher.trigger(input?.userId, "fe", {
          type: 'follow',
        });

        return {followed: true}
      }else{
        await ctx.prisma.user.update({
          where : {
            id: ctx?.session?.user?.id
          },
          data: {
            follows: {
              disconnect:{
                id: input?.userId
              }
            }
          }
        }).catch(err => {
          console.log(err);
        });

        const notifId = await ctx.prisma.notification.findFirst({
          where: {
            userId: input?.userId,
            senderId: ctx?.session?.user?.id
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
  
          await pusher.trigger(input?.userId, "fe", {
            type: 'follow',
          });
        }

        return {followed: false}
      }
      
  }),
  
  feed: protectedProcedure
    .query(async ({ctx}) => {
      const myFollowingsList = await ctx.prisma?.user?.findUnique({
        where: {
          id: ctx?.session?.user?.id
        },
        select: {
          follows: {
            select: {
              id: true
            }
          }
        }
      });
        const myFollowings = myFollowingsList?.follows?.map(item => item?.id) ?? [];
        const result = await ctx.prisma.thoughts.findMany({
          where: {
            userId: {
              in: [...myFollowings, ctx?.session?.user?.id]
            },
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


