import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { HumanMessage } from "@langchain/core/messages";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a political analyst providing concise candidate information.
    
    Create a SINGLE PARAGRAPH summary (maximum 3-4 sentences) that captures the essence of this political candidate.
    Include their name, party affiliation, most relevant experience, and key platform positions if available.
    Be factual, balanced, and avoid showing political bias.
    Focus only on the most important information voters should know.
    
    ALWAYS use web search to verify facts about the candidate before summarizing.`,
  ],
  ["placeholder", "{messages}"],
]);

const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0.1,
});

const searchTool = new TavilySearchResults({
  maxResults: 3,
});

const llmWithTools = llm.bindTools([searchTool]);

const chain = prompt.pipe(llmWithTools);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const toolChain = RunnableLambda.from(async (userInput: string, config) => {
      const formattedInput = `Please provide a concise, single-paragraph summary about this political candidate: ${userInput}. 
      Search for current information about them to verify facts.`;

      const humanMessage = new HumanMessage(formattedInput);

      const aiMsg = await chain.invoke(
        {
          messages: [new HumanMessage(userInput)],
        },
        config
      );

      const toolMsgs = await searchTool.batch(aiMsg.tool_calls!, config);
      return chain.invoke(
        {
          messages: [humanMessage, aiMsg, ...toolMsgs],
        },
        config
      );
    });

    const toolChainResult = await toolChain.invoke(body.input);
    console.log(toolChainResult)

    return NextResponse.json({
      data: toolChainResult.content,
      status: 200,
    });
  } catch (error) {
    console.error("Chat endpoint error: ", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
