// scripts/check-models.js
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load API Key manually from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/GOOGLE_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : null;

if (!apiKey) {
  console.error("❌ Could not find GOOGLE_API_KEY in .env.local");
  process.exit(1);
}

console.log("🔍 Checking available Gemini models...");

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.error) {
        console.error("❌ API Error:", response.error.message);
      } else {
        console.log("✅ API Connection Successful! You can use these models:\n");
        const chatModels = response.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
        chatModels.forEach(m => {
            console.log(`Model Name: "${m.name.replace('models/', '')}"`);
        });
        console.log("\n👉 Please pick one of the names above for your API route.");
      }
    } catch (e) {
      console.error("Error parsing response:", e);
    }
  });
}).on('error', (e) => {
  console.error("Connection error:", e);
});