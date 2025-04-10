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

export const skillFormat = z.object({
    education: z.number().describe("Score from 0 to 100 based on the strength and relevance of the candidate's academic background."),
    educationReasoning: z.string().describe("A one to two sentences explanation or reasoning to the provided education score"),
    experience: z.number().describe("Score from 0 to 100 based on the candidate's leadership, public service, or career achievements."),
    experienceReasoning: z.string().describe("A one to two sentences explanation or reasoning to the provided experience score"),
    platformAndAdvocacy: z.number().describe("Score from 0 to 100 based on how clear, relevant, and actionable the candidate’s platform and advocacy are."),
    platformAndAdvocacyReasoning: z.string().describe("A one to two sentences explanation or reasoning to the provided platform and advocacy score"),
  });
  