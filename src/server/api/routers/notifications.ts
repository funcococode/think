/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
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
                createdAt: true
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

//   find: protectedProcedure
//     .input(z.object({ query: z.string().trim()}))
//     .query(async ({ctx, input }) => {
//       const result = await ctx.prisma.user.findMany({
//         where: {
//           name:{
//             startsWith: input?.query
//           },
//           id: {
//             not: {
//               equals: ctx?.session?.user?.id
//             }
//           }
//         },
//         select: {
//           id: true,
//           name: true,
//           email: true
//         },
//         take: 10
//       }).catch(err => {
//         console.log(err);
//       })
//       return result
//   }),
  
});

