import { google } from "googleapis";
import OpenAI from "openai";
import "dotenv/config";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = "1I4z67X3sQRrlYotiEuor_AXj--AmQg_GBL8aMASXmh8";
const range = "Аркуш1!L2:M";

const fetchTags = async () => {
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = res.data.values || [];
  return rows.map(row => ({
    longTags: row[0]?.split(",") || [],
    shortTags: row[1]?.split(",") || [],
  }));
};

async function optimizeWithGPT(tags) {
  const prompt = `Тобі надано теги для Etsy: ${tags.join(", ")}.

Згенеруй 2 набори нових тегів у форматі JSON:
{
  "longTags": [...],
  "shortTags": [...]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  let text = response.choices[0].message.content.replace(/```/g, "").trim();

  try {
    const parsed = JSON.parse(text);
    return { longTags: parsed.longTags || [], shortTags: parsed.shortTags || [] };
  } catch (e) {
    console.error("❌ Не вдалося розпарсити JSON:", text);
    return { longTags: [], shortTags: [] };
  }
}

async function fakeUpdateListing(listingId, data) {
  console.log(`💾 Лістинг ${listingId} оновлено:`, data);
  await sleep(500);
}

export default async function runAll() {
  const listings = await fetchTags();
  if (!listings.length) return console.log("❌ Немає лістингів");

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];
    console.log(`\n🔹 Обробка лістингу ${i + 1}...`);
    const optimized = await optimizeWithGPT([...listing.longTags, ...listing.shortTags]);
    console.log("✨ LongTags:", optimized.longTags);
    console.log("✨ ShortTags:", optimized.shortTags);
    await fakeUpdateListing(i + 1, optimized);
  }

  console.log("\n✅ Усі лістинги оброблені.");
}
