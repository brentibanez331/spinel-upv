import { ChatPromptTemplate } from "@langchain/core/prompts";
import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { skillFormat } from "@/utils/schema";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    temperature: 0.1
});

const structuredLLM = llm.withStructuredOutput(skillFormat, {
    name: "skillResponse"
})

const searchTool = new TavilySearchResults({
    maxResults: 2
})

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.input;  //only holds the name

    const experienceResults = await searchTool.invoke(`Job experience of ${name}`)
    const educationResults = await searchTool.invoke(`Education of ${name}`)
    const platformResults = await searchTool.invoke(`Platform and Advocacy of ${name}`)

    const enhancedPrompt = `
You are evaluating a senatorial candidate from the Philippines based on three core criteria: Education, Career Experience, and Platform & Advocacy.

Please rate the candidate on a scale from 0 to 100 for each category based on how they compare to an ideal Filipino senator.
Include a one to two sentences of reasoning for the scores for each category. Do not include the name of the candidate in the reasoning. 
Avoid mentioning the criteria within the reasoning.

Use the following baselines for scoring:

1. **Education** (Ideal: 100%)
   - Graduate of a reputable university (e.g., UP, Ateneo, La Salle, international equivalent)
   - Has at least a Bachelor's degree related to law, public policy, economics, or political science
   - Bonus: Postgraduate degrees or continuing education

2. **Career / Experience** (Ideal: 100%)
   - 10+ years of experience in public service, law, or leadership roles
   - Previous roles as legislator, governor, mayor, or in executive positions
   - Proven record of ethical leadership and accomplishments

3. **Platform & Advocacy** (Ideal: 100%)
   - Has a clear and consistent platform relevant to national issues (e.g., education reform, poverty alleviation, health care)
   - Advocated or authored meaningful legislation or community programs
   - Public speeches, campaign materials, or endorsements align with democratic values and public welfare

Give your best estimate for each category based on the following search results. If information is missing or weak, reduce the score accordingly.

Search Results:

**Experience:**
${JSON.stringify(experienceResults)}

**Education:**
${JSON.stringify(educationResults)}

**Platform & Advocacy:**
${JSON.stringify(platformResults)}
`

    const result = await structuredLLM.invoke(enhancedPrompt)

    console.log(result)

    return NextResponse.json({
        data: {
            experience: result.experience,
            education: result.education,
            platform: result.platformAndAdvocacy
        },
        status: 200
    })

  } catch (error) {
    console.error("Chat endpoint error: ", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
