import fetch from "node-fetch"; // імпортуємо fetch як ES module

// твій ключ API
const API_KEY = "2mix1guy02w1qdhdjakvglcg";

async function testPing() {
  try {
    const response = await fetch("https://openapi.etsy.com/v3/application/openapi-ping", {
      headers: {
        "x-api-key": API_KEY
      }
    });

    if (!response.ok) {
      console.log("Помилка:", response.status, response.statusText);
      return;
    }

    const data = await response.json();
    console.log("API відповів успішно:", data);
  } catch (err) {
    console.error("Помилка запиту:", err);
  }
}

testPing();
