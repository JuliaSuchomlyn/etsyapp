import { google } from "googleapis";
import fs from "fs";
import OpenAI from "openai";
import "dotenv/config";


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// 🔑 API ключ GPT
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // обов'язково зроби .env з ключем
});


// Підключаємо credentials
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",  // шлях до твоєго файлу
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

const spreadsheetId = "1I4z67X3sQRrlYotiEuor_AXj--AmQg_GBL8aMASXmh8"; // бере з URL Google Sheets
const range = "Аркуш1!L2:M"; // діапазон, де у тебе LongTags і ShortTags

const fetchTags = async () => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  //console.log("✅ Повна відповідь від Google Sheets:", res.data); // <- ось тут
  const rows = res.data.values || [];
  //console.log("📄 Рядки з таблиці:", rows); // <- тут бачимо масив рядків
  return rows.map(row => ({
    longTags: row[0]?.split(",") || [],
    shortTags: row[1]?.split(",") || [],
  }));
};

// === твій існуючий код вище (отримує теги) ===

// === GPT оптимізація ===
async function optimizeWithGPT(tags) {
  const prompt = `Тобі надано теги для Etsy: ${tags.join(", ")}.

Згенеруй **2 набори нових, релевантних тегів**, покращених для SEO:

1️⃣ LongTags (до 13 тегів, кожен до 30 символів, більш детальні та привабливі)
2️⃣ ShortTags (до 13 тегів, кожен до 20 символів, короткі і чіткі)

Теги повинні бути релевантними, можливо замінити, покращити, додати популярні варіанти.  
Відповідь строго у форматі JSON без пояснень, приклад:

{
  "longTags": ["long tag 1", "long tag 2", ...],
  "shortTags": ["short1", "short2", ...]
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  let text = response.choices[0].message.content;

  text = text.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(text);
    return {
      longTags: parsed.longTags || [],
      shortTags: parsed.shortTags || [],
    };
  } catch (e) {
    console.error("❌ Не вдалося розпарсити JSON від GPT:", text);
    return { longTags: [], shortTags: [] };
  }
}


// Імітація оновлення лістингу
async function fakeUpdateListing(listingId, data) {
  console.log(`💾 Лістинг ${listingId} оновлено з даними:`, data);
  // Тут можна додати маленьку затримку, щоб було схоже на реальний апдейт
  await new Promise(resolve => setTimeout(resolve, 500));
}

/*async function run() {
const listings = await fetchTags(); // масив [{ longTags: [...], shortTags: [...] }, ...]

if (listings.length === 0) {
    console.log("❌ Немає лістингів у таблиці");
    return;
  }

  // беремо тільки перший лістинг для тесту
  const first = listings[0];
  console.log("\nТестуємо перший лістинг...");

  // виклик GPT для оптимізації
  const optimized = await optimizeWithGPT([...first.longTags, ...first.shortTags]);

  console.log("✨ Оптимізовані теги від GPT:", optimized);

  // імітуємо оновлення
  await fakeUpdateListing(1, { tags: optimized });
  
}*/
async function runAll() {
  const listings = await fetchTags();

  if (listings.length === 0) {
    console.log("❌ Немає лістингів у таблиці");
    return;
  }

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];
    console.log(`\n🔹 Обробка лістингу ${i + 1}...`);

    const optimized = await optimizeWithGPT([...listing.longTags, ...listing.shortTags]);

    console.log("✨ LongTags:", optimized.longTags);
    console.log("✨ ShortTags:", optimized.shortTags);

    // імітуємо оновлення
    await fakeUpdateListing(i + 1, optimized);

    // ставимо затримку перед наступним лістингом (наприклад, 1-2 секунди)
    await sleep(500);
  }

  console.log("\n✅ Усі лістинги оброблені.");
}

//run();
runAll();

