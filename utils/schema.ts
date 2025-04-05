import { z } from "zod";

export const responseFormat = z.object({
  answer: z.string().describe("A detailed response to the user's question"),
  followUpQuestions: z
    .array(z.string())
    .describe("Three relevant follow-up questions"),
});