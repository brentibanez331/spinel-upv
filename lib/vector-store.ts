import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "./config";

export async function embedAndStoreDocs(
    client: Pinecone,
    // @ts-ignore docs type error
    docs: Document<Record<string, any>>[]
){
    try{
        if(!client){
            throw new Error("Pinecone client is null")
        }

        const embeddings = new OpenAIEmbeddings({
            apiKey: env.OPENAI_API_KEY
        });
        
        const index = client.Index(env.PINECONE_INDEX_NAME)

        await PineconeStore.fromDocuments(docs, embeddings, {
            pineconeIndex: index,
            namespace: env.PINECONE_NAME_SPACE,
            textKey: "text"
        })
    } catch (e) {
        console.error("error ", e);
        throw new Error("Failed to load your docs !")
    }
}


