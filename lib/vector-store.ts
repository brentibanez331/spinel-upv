import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "./config";

export async function embedAndStoreDocs(
  client: Pinecone,
  // @ts-ignore docs type error
  docs: Document<Record<string, any>>[]
) {
  try {
    if (!client) {
      throw new Error("Pinecone client is null");
    }

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: env.OPENAI_API_KEY,
    });

    const index = client.Index(env.PINECONE_INDEX_NAME);

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: env.PINECONE_NAME_SPACE,
      textKey: "text",
    });
  } catch (e) {
    console.error("error ", e);
    throw new Error("Failed to load your docs !");
  }
}

export async function getVectorStore(client: Pinecone) {
  try {
    const embeddings = new OpenAIEmbeddings();
    const index = client.Index(env.PINECONE_INDEX_NAME);

    const stats = await index.describeIndexStats();
    console.log("Index stats:", stats);

    const vectorCount = stats.totalRecordCount || 0;
    console.log(`Total vectors in index: ${vectorCount}`);
    if (vectorCount === 0) {
      console.warn(
        "WARNING: Your Pinecone index appears to be empty. No vectors found."
      );
    }

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text",
      namespace: env.PINECONE_NAME_SPACE || ""
    });

    return vectorStore;
  } catch (error) {
    console.log("error ", error);
    throw new Error("Something went wrong while getting vector store !");
  }
}
