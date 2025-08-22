import { google } from "googleapis";
import OpenAI from "openai";
import "dotenv/config";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- OpenAI setup ---
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY not set!");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Google Sheets setup ---
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = "1I4z67X3sQRrlYotiEuor_AXj--AmQg_GBL8aMASXmh8";
const range = "Аркуш1!L2:M";

// --- Fetch tags from sheet ---
const fetchTags = async () => {
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = res.data.values || [];
  return rows.map(row => ({
    longTags: row[0]?.split(",") || [],
    shortTags: row[1]?.split(",") || [],
  }));
};

// --- GPT optimization ---
async function optimizeWithGPT(tags) {
  const prompt = `Тобі надано теги для Etsy: ${tags.join(", ")}.

Згенеруй 2 набори нових тегів у форматі JSON:
{
  "longTags": [...],
  "shortTags": [...]
}`;

  console.log("💬 Sending prompt to OpenAI:", prompt);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices?.[0]?.message?.content;
    if (!text) throw new Error("GPT returned undefined");

    const cleanText = text.replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanText);
    return { longTags: parsed.longTags || [], shortTags: parsed.shortTags || [] };
  } catch (err) {
    console.error("❌ GPT request failed:", err);
    return { longTags: [], shortTags: [] };
  }
}

// --- Fake update function ---
async function fakeUpdateListing(listingId, data) {
  console.log(`💾 Listing ${listingId} updated:`, data);
  await sleep(500);
}

// --- Run all ---
export default async function runAll() {
  const listings = await fetchTags();
  if (!listings.length) return console.log("❌ No listings found");

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];
    console.log(`\n🔹 Processing listing ${i + 1}...`);
    const optimized = await optimizeWithGPT([...listing.longTags, ...listing.shortTags]);
    console.log("✨ LongT
