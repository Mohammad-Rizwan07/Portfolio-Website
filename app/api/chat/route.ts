import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) return NextResponse.json({ response: "Error: No input provided." });

    // 1. Embed the user's message using the correct embedding model
    const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    
    const embeddingResult = await embeddingModel.embedContent(message);
    const queryVector = embeddingResult.embedding.values;

    // 2. Query Pinecone
    const index = pc.index(process.env.PINECONE_INDEX_NAME!);
    const queryResponse = await index.namespace("portfolio").query({
      vector: queryVector,
      topK: 4,
      includeMetadata: true,
    });

    // 3. Build Context
    const contextText = queryResponse.matches
      .map((match) => match.metadata?.text)
      .join("\n\n---\n\n");

    // 4. Send to Gemini (using the newer, working model)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    
    const prompt = `
      You are a CLI / Terminal Assistant for a developer's portfolio.
      Your name is "System v1".
      
      Instructions:
      1. Answer the user's question STRICTLY based on the Context provided below.
      2. If the answer is not in the context, say: "ACCESS DENIED: Information not available in database."
      3. Keep the tone: Technical, Cyberpunk, Professional but cool.
      4. Do not mention "context" or "database" in your answer. Just answer.

      Context Data:
      ${contextText}

      User Question: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ response: response.text() });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ response: "SYSTEM FAILURE: API connection interrupted." }, { status: 500 });
  }
}