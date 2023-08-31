import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import OpenAI from "openai";

export const openAiRouter = createTRPCRouter({
    randomFact: protectedProcedure
      .input(z.object({ content: z.string().optional() }))
      .query(async ({ctx,input }) => {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const chatCompletion = await openai.chat.completions.create({
            messages: [
              { 
                role: "user", 
                content: input?.content ?? 'Give me a interesting 2am thought'
              }
            ],
            model: "gpt-3.5-turbo",
        });
        const result = chatCompletion;
        return result
    }),
});