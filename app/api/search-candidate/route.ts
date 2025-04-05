import { NextRequest, NextResponse } from "next/server";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { HumanMessage } from "@langchain/core/messages";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["placeholder", "{messages}"],
]);

const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0.1,
});

const searchTool = new TavilySearchResults({
  maxResults: 10,
});

const llmWithTools = llm.bindTools([searchTool]);

const chain = prompt.pipe(llmWithTools);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const toolChain = RunnableLambda.from(async (userInput: string, config) => {
      const humanMessage = new HumanMessage(userInput);
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

    return NextResponse.json({ data: toolChainResult.content, status: 200 });
  } catch (error) {
    console.error("Chat endpoint error: ", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
