import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "./config";
import { delay } from "./utils";

let pineconeClient: Pinecone | null = null;
async function createIndex(client: Pinecone, indexName: string) {
  try {
    await client.createIndex({
      name: indexName,
      dimension: 1536,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });

    console.log(
      `Waiting for ${env.INDEX_INIT_TIMEOUT} seconds for index initialization to complete...`
    );
    await delay(env.INDEX_INIT_TIMEOUT);
    console.log("Index created !!");
  } catch (error) {
    console.error("error ", error);
    throw new Error("Index creation failed");
  }
}

async function initPinecone() {
  try {
    const pinecone = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });

    const indexName = env.PINECONE_INDEX_NAME;

    const existingIndices = await pinecone.listIndexes();
    const indexExists = existingIndices.indexes?.some(
      (index) => index.name === indexName
    ) || false;

    if (!indexExists) {
        await createIndex(pinecone, indexName);
      } else {
        console.log("Your index already exists. nice !!");
      }

    return pinecone;
  } catch (error) {
    console.error("error ", error);
    throw new Error("Failed to initialize Pinecone client");
  }
}

export async function getPineconeClient() {
  if (!pineconeClient) {
    pineconeClient = await initPinecone();
  }

  return pineconeClient;
}
