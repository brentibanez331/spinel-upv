import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { UnstructuredLoader } from "@langchain/community/document_loaders/fs/unstructured";
import { env } from "./config";

export async function getChunkedDocsFromMarkdown() {
  try {
    // const markdownPath = "../../../../README.md";
    // const loader = new PDFLoader(env.PDF_PATH);
    const loader = new UnstructuredLoader(env.PDF_PATH, {
      apiKey: process.env.UNSTRUCTURED_API_KEY,
      apiUrl: process.env.UNSTRUCTURED_API_URL,
    });

    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1250,
      chunkOverlap: 100,
    });

    const chunkedDocs = await textSplitter.splitDocuments(docs);

    return chunkedDocs;
  } catch (e) {
    console.error(e);
    throw new Error("PDF docs chunking failed !");
  }
}
