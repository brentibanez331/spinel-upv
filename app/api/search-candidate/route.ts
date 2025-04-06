import { NextRequest, NextResponse } from "next/server";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import { responseFormat } from "@/utils/schema";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful assistant with access to web search. Use search when you need up-to-date information.

  After answering the user's question, always suggest 3 short relevant follow-up questions. Replace any names with the pronoun of the person of interest.
  The language of your response must base on the language of the question provided to you.

    Avoid showing political bias or favoritism.
    Write in a clear, professional style suitable for voters seeking information.

  Make sure your follow-up questions are relevant to the conversation context and the candidate being discussed.`,
  ],
  ["placeholder", "{messages}"],
]);

const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0.1,
});

const structuredLLM = llm.withStructuredOutput(responseFormat, {
  name: "searchResponse",
});

const searchTool = new TavilySearchResults({
  maxResults: 3,
});

// const llmWithTools = llm.bindTools([searchTool]);

// const chain = prompt.pipe(llmWithTools);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userInput = body.input;

    const searchResults = await searchTool.invoke(userInput);

    const enhancedPrompt = `
User Question: ${userInput}
    
Search Results:
${JSON.stringify(searchResults)}

Please answer the question based on the search results and suggest 3 follow-up questions. The language of your response and follow up questions must base on the language of the user question.
`;

    // const toolChain = RunnableLambda.from(async (userInput: string, config) => {
    //   const humanMessage = new HumanMessage(userInput);
    //   const aiMsg = await chain.invoke(
    //     {
    //       messages: [new HumanMessage(userInput)],
    //     },
    //     config
    //   );

    //   const toolMsgs = await searchTool.batch(aiMsg.tool_calls!, config);
    //   return chain.invoke(
    //     {
    //       messages: [humanMessage, aiMsg, ...toolMsgs],
    //     },
    //     config
    //   );
    // });

    // const toolChainResult = await toolChain.invoke(body.input);

    // console.log(toolChainResult.content);

    // let responseData;
    // try {
    //   responseData = JSON.parse(toolChainResult.content.toString());
    // } catch (e) {
    //   return NextResponse.json({
    //     data: { response: toolChainResult.content, questions: [] },
    //     status: 200,
    //   });
    // }

    // const followUpQuestions = responseData.followUpQuestions || [];
    // console.log(followUpQuestions);

    const result = await structuredLLM.invoke(enhancedPrompt);

    return NextResponse.json({
      data: {
        answer: result.answer,
        questions: result.followUpQuestions,
      },
      status: 200,
    });

    // return NextResponse.json({ data: toolChainResult.content, status: 200 });
  } catch (error) {
    console.error("Chat endpoint error: ", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
