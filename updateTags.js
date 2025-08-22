import { google } from "googleapis";
import OpenAI from "openai";
import "dotenv/config";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- OpenAI setup ---
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY not set!");
  process.exit(1);
}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Google Sheets setup ---
if (!process.env.GSHEETS_CREDENTIALS) {
  console.error("❌ GSHEETS_CREDENTIALS not set!");
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
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

  let response;
  try {
    response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
  } catch (err) {
    console.error("❌ OpenAI request failed:", err);
    return { longTags: [], shortTags: [] };
  }

  console.log("💬 GPT raw response object:", response);

  const text = response.choices?.[0]?.message?.content;
  if (!text) {
    console.error("❌ GPT returned undefined!");
    return { longTags: [], shortTags: [] };
  }

  let cleanText = text.replace(/```/g, "").trim();

  try {
    const parsed = JSON.parse(cleanText);
    return { longTags: parsed.longTags || [], shortTags: parsed.shortTags || [] };
  } catch (e) {
    console.error("❌ Failed to parse JSON from GPT:", cleanText);
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
    console.log("✨ LongTags:", optimized.longTags);
    console.log("✨ ShortTags:", optimized.shortTags);
    await fakeUpdateListing(i + 1, optimized);
  }

  console.log("\n✅ All listings processed.");
}

// --- Auto-run if called directly ---
if (require.main === module) {
  runAll();
}
