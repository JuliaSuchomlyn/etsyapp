import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import { fetchListingsFromSheets } from "../modules.js";

const __filename = fileURLToPath(import.meta.url);

dotenv.config({ path: path.resolve(process.cwd(), "secrets/.env") });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// функція оптимізації тегів одного лістингу
const optimizeTagsForListing = async (listing) => {
  const { title, description, LongTags, ShortTags } = listing;

  const prompt = `
You are an expert Etsy SEO assistant. Optimize tags for an Etsy listing.

Title: ${title}
Description: ${description}
Current LongTags: ${LongTags.join(", ")}
Current ShortTags: ${ShortTags.join(", ")}

Requirements:
1. Optimize LongTags (13 tags, max 30 characters each).
2. Optimize ShortTags (13 tags, max 20 characters each).
3. Avoid duplicates; make tags human-readable, appealing, and SEO-friendly.
4. Tags must be relevant to the product, buyer intent, and Etsy search trends.

Return ONLY JSON in this format:

{
  "LongTags": ["tag1", "tag2", ...],
  "ShortTags": ["tag1", "tag2", ...]
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  try {
    let content = response.choices[0].message.content;
    content = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(content);

    return { 
      ...listing, 
      LongTags: parsed.LongTags.map(tag => tag.trim()), 
      ShortTags: parsed.ShortTags.map(tag => tag.trim()) };

  } catch (err) {
    console.error("Error parsing AI response for listing", listing.listing_id, err);
    return listing; // повертаємо без змін у випадку помилки
  }
};

// функція оновлення всіх лістингів пакетами
export default async function updateTags (batchSize = 5, delayMs = 1000) {
  const listings = await fetchListingsFromSheets(); // отримуємо всі дані з таблиці
  const updatedListings = [];

  for (let i = 0; i < listings.length; i += batchSize) {
    const batch = listings.slice(i, i + batchSize);

    // обробка всіх лістингів у батчі паралельно
    const batchResults = await Promise.all(batch.map(listing => optimizeTagsForListing(listing)));
    updatedListings.push(...batchResults);

    console.log(`Updated tags for batch: ${batch.map(l => l.listing_id).join(", ")}`);

    // пауза після кожного пакета
    await new Promise(res => setTimeout(res, delayMs));
  }
 

  return updatedListings;
};

