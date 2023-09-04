/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { number, z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const notificationRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({ 
            recieverId: z.string().trim(), 
            senderId: z.string().trim(),
            type: z.string(),
            thoughtId: z.string().trim().optional(),
            commentId: z.string().trim().optional()
        }))
        .mutation(async ({ctx, input}) => {
            await ctx?.prisma?.notification?.create({
                data: {
                    userId: input?.recieverId,
                    senderId: input?.senderId,
                    type: input?.type,
                    thoughtId: input?.thoughtId,
                    commentId: input?.commentId
                }
            }).catch(err => {
                console.log(err);
                return {created: false}
            })

            return {created: true};
        }),
    list: protectedProcedure
        .input(z.object({ userId: z.string().trim(), from: z.string().optional(), to: z.string().optional()}))
        .query(async ({ctx, input }) => {
        const result = await ctx.prisma.notification.findMany({
            where: {
                userId:input?.userId
            },
            select:{
                id: true,
                type: true,
                thoughtId: true,
                commentId: true,
                seen: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                createdAt: true,
                _count: {
                    select:{
                        comment: true,
                        like: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }).catch(err => {
            console.log(err);
        })
        console.log(result, "HELLOO")
        if(!result) return null;
        return result;
    }),

  markRead: protectedProcedure
    .input(z.object({ notifId: z.string().array()}))
    .mutation(async ({ctx, input }) => {
      await ctx.prisma.notification.updateMany({
        where: {
            id: {
                in: input.notifId
            }
        },
        data: {
            seen: true
        }
      }).catch(err => {
        console.log(err);
        return {markRead: false};
      })
      return {markRead: true};
  }),
  
});

