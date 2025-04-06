import { z } from "zod";

export const responseFormat = z.object({
  answer: z.string().describe("A detailed response to the user's question"),
  followUpQuestions: z
    .array(z.string())
    .describe("Three relevant follow-up questions"),
});

export const summaryFormat = z.object({
    englishSummary: z.string().describe("The english version of the subject's summary"),
    tagalogSummary: z.string().describe("The tagalog version of the subject's summary")
})