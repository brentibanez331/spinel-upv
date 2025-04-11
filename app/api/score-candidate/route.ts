import { ChatPromptTemplate } from "@langchain/core/prompts";
import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { skillFormat } from "@/utils/schema";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

type ExtractedSearch = {
  title: string
  url: string
  content: string
}

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
    const educationResults = await searchTool.invoke(`Educational background of ${name}`)
    const platformResults = await searchTool.invoke(`Platform and Advocacy of ${name}`)

    const experienceData: ExtractedSearch[] = JSON.parse(experienceResults)
    const educationData: ExtractedSearch[] = JSON.parse(educationResults)
    const platformData: ExtractedSearch[] = JSON.parse(platformResults)

    const experienceUrls = experienceData.map(item => ({title: item.title, url: item.url}))
    const educationUrls = educationData.map(item => ({title: item.title,url: item.url}))
    const platformUrls = platformData.map(item => ({title: item.title, url: item.url}))

    console.log(platformUrls)

    const enhancedPrompt = `
You are evaluating a senatorial candidate from the Philippines based on three core criteria: Education, Career Experience, and Platform & Advocacy.

Please rate the candidate on a scale from 0 to 100 for each category based on how they compare to an ideal Filipino senator.
Include a one to two sentences reasoning for the scores for each category. Start your reasonings with the name of the candidate.
Avoid mentioning the criteria and score or range within the reasoning.

Use the following detailed scoring guidelines:

1. **Education** 
   - Excellent (90-100%): Law degree (J.D., LL.B., etc.) from a top-tier university (UP, Ateneo, La Salle, international equivalent) or graduate/postgraduate degrees in law, public policy, economics, or political science. The presence of a legal education should be heavily weighted in this criterion.
   - Good (80-89%): Bachelor's degree from a reputable university in a relevant field (especially public administration, political science, etc.) with some continuing education or specialized training in law-related courses.
   - Average (60-79%): Bachelor's degree from a lesser-known institution or in a field not directly related to governance or law.
   - Below Average (40-59%): Incomplete tertiary education or education in fields with minimal relevance to public service or legal frameworks.
   - Poor (0-39%): Limited formal education or insufficient information about educational background.

2. **Career / Experience** 
   - Excellent (90-100%): 10+ years in significant public service roles (legislator, governor, mayor) with documented accomplishments and ethical leadership.
   - Good (80-89%): 5-9 years in public service positions or equivalent leadership experience in relevant private sector or NGO roles.
   - Average (60-79%): Some experience in local governance or limited national exposure; or primarily private sector experience with some public service connection.
   - Below Average (40-59%): Minimal governance experience or primarily in appointed rather than elected positions.
   - Poor (0-39%): No significant public service experience or insufficient information about career background.

3. **Platform & Advocacy** 
   - Excellent (90-100%): Clear, comprehensive platform addressing critical national issues with proven track record of advocacy and successful implementation of related policies.
   - Good (80-89%): Well-defined platform on multiple issues with some evidence of previous advocacy work or community programs.
   - Average (60-79%): General platform statements without specificity or limited evidence of previous advocacy commitment.
   - Below Average (40-59%): Vague platform focusing on popular issues without substantive plans or minimal record of advocacy.
   - Poor (0-39%): No clear platform, inconsistent messaging, or insufficient information about advocacy positions.

IMPORTANT: Be critical and precise in your evaluation. If information is missing, ambiguous, or contradictory, this should be reflected in lower scores. A score of 80 or above should only be given when there is clear, substantive evidence meeting the criteria. Avoid inflating scores when information is limited.

Give your best estimate for each category based on the following search results:

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
            experienceReasoning: result.experienceReasoning,
            experienceUrls: experienceUrls,
            education: result.education,
            educationReasoning: result.educationReasoning,
            educationUrls: educationUrls,
            platform: result.platformAndAdvocacy,
            platformReasoning: result.platformAndAdvocacyReasoning,
            platformUrls: platformUrls
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
