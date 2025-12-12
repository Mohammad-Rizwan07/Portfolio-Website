import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { PORTFOLIO_DATA } from "../lib/mockData";

// Load environment variables
dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

// A helper function to wait (sleep) for a specific time
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function seed() {
  console.log("🌱 Seeding Pinecone...");

  // CHANGE 1: Use the newer model
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" }); 

  
  const index = pc.index(process.env.PINECONE_INDEX_NAME!);

  const vectors = [];

  for (const item of PORTFOLIO_DATA) {
    console.log(`Processing: ${item.id}...`);
    
    try {
      // Generate Embedding
      const result = await model.embedContent(item.text);
      const embedding = result.embedding.values;

      vectors.push({
        id: item.id,
        values: embedding,
        metadata: { text: item.text },
      });

      // CHANGE 2: Wait 2 seconds between requests to avoid Rate Limits
      await sleep(2000); 

    } catch (error) {
      console.error(`Error embedding ${item.id}:`, error);
    }
  }

  // Upsert to Pinecone
  if (vectors.length > 0) {
    await index.namespace("portfolio").upsert(vectors);
    console.log(`✅ Successfully uploaded ${vectors.length} items to Pinecone!`);
  } else {
    console.log("❌ No vectors were created due to errors.");
  }
}

seed().catch(console.error);