import { google } from "googleapis";
import "dotenv/config";

async function testSheets() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json", // твій файл service account
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = "1I4z67X3sQRrlYotiEuor_AXj--AmQg_GBL8aMASXmh8";
    const range = "Аркуш1!L2:M";

    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });

    console.log("✅ Успіх! Дані з Google Sheet:", res.data.values);
  } catch (err) {
    console.error("❌ Помилка доступу до Google Sheet:", err.message);
  }
}

testSheets();
