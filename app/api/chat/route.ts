import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // 1. Convert user question to numbers (embedding)
    const embeddingModel = genAI.getGenerativeModel({ model: "embedding-004" });
    const embeddingResult = await embeddingModel.embedContent(message);
    const queryVector = embeddingResult.embedding.values;

    // 2. Search Pinecone for matching data
    const index = pc.index(process.env.PINECONE_INDEX_NAME!);
    const queryResponse = await index.namespace("portfolio").query({
      vector: queryVector,
      topK: 3,
      includeMetadata: true,
    });

    // 3. Combine found data into text
    const contextText = queryResponse.matches
      .map((match) => match.metadata?.text)
      .join("\n\n");

    // 4. Send to Gemini AI to generate answer
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      You are a CLI assistant for a developer's portfolio. 
      Answer strictly based on the context provided.
      Keep answers technical, cool, and brief.
      Context: ${contextText}
      User Query: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ response: response.text() });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ response: "Error: System Malfunction." }, { status: 500 });
  }
}