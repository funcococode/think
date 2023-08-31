/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import bcrypt from 'bcrypt';
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const registrationRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ name: z.string(),email: z.string().email(),password: z.string() }))
    .mutation(async ({ctx, input }) => {
      const hashedPassword = bcrypt.hashSync(input?.password, 10);
      const result = await ctx.prisma.user.create({
        data: {
          name: input?.name,
          email: input?.email,
          password: hashedPassword
        }
      }).catch(err => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ...err.meta,
          ok: false
        }
      })
      return result;
    }),
});
