import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { HumanMessage } from "@langchain/core/messages";

type ExtractedSearch = {
  title: string;
  url: string;
  content: string;
};

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a political analyst providing concise candidate information about the Philippine Voting System.
    
    Use ONLY the search results provided to answer the user's question.
    Be factual, balanced, and avoid showing political bias.
    Focus only on the most important information voters should know.
    The language of your response must match the language of the user input.
    
    If the search results don't contain relevant information, acknowledge this limitation politely.
    
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
    let searchResults: ExtractedSearch[] = [];

    const toolChain = RunnableLambda.from(async (userInput: string, config) => {
      const formattedInput = userInput;

      const humanMessage = new HumanMessage(formattedInput);

      const aiMsg = await chain.invoke(
        {
          messages: [new HumanMessage(userInput)],
        },
        config
      );

      const toolMsgs = await searchTool.batch(aiMsg.tool_calls!, config);

      searchResults = JSON.parse(toolMsgs[0].content);
      console.log("TOOL MSG JSON: ", searchResults);

      return chain.invoke(
        {
          messages: [humanMessage, aiMsg, ...toolMsgs],
        },
        config
      );
    });

    const toolChainResult = await toolChain.invoke(body.input);

    const searchUrls = searchResults.map((item) => ({
      title: item.title,
      url: item.url,
    }));

    console.log("Search URLS: ", toolChainResult);
    return NextResponse.json({
      data: { summary: toolChainResult.content, sources: searchUrls },
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
