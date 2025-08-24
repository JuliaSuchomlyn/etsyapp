import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Абсолютний шлях до цього файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Шлях до credentials.json
const CREDENTIALS_PATH = path.join(__dirname, "../secrets/credentials.json");

// Читаємо і парсимо JSON
const rawData = fs.readFileSync(CREDENTIALS_PATH, "utf-8");
const credentials = JSON.parse(rawData);

// Замінюємо \n на реальні переводи рядків
const privateKey = credentials.private_key.replace(/\\n/g, "\n").trim();

// Створюємо JWT клієнт
const client = new google.auth.JWT({
  email: credentials.client_email,
  key: privateKey,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

// ID таблиці та діапазон
const SPREADSHEET_ID = "1I4z67X3sQRrlYotiEuor_AXj--AmQg_GBL8aMASXmh8";
const RANGE = "Аркуш1!J2:M";

export const fetchListingsFromSheets = async () => {
  try {
    console.log("Авторизація JWT клієнта...");
    await client.authorize(); // авторизація
    const sheets = google.sheets({ version: "v4", auth: client });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = res.data.values || [];
    return rows.map((row, index) => ({
      listing_id: index + 1,
      title: row[0],
      description: row[1] || "",
      LongTags: row[2] ? row[2].split(",") : [],   // L: LongTags (12-та колонка, індекс 11)
      ShortTags: row[3] ? row[3].split(",") : [], // M: ShortTags (13-та колонка, індекс 12)
    }));
  } catch (err) {
    console.error("Помилка при отриманні даних з Google Sheets:", err);
    return [];
  }
};
