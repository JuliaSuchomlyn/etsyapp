import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const access_token = process.env.ETSY_ACCESS_TOKEN;
const shop_id = process.env.ETSY_SHOP_ID;

export const fetchListings = async () => {
  const url = `https://api.etsy.com/v3/application/shops/${shop_id}/listings`;
  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': process.env.ETSY_API_KEY,
        'Authorization': `Bearer ${access_token}`,
      },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const data = await response.json();
    return data.results;
  } catch (err) {
    console.log("Помилка отримання лістингів:", err.message);
    return [];
  }
};

// Тестовий варіант
export const fetchListingsTest = async () => [
  { listing_id: 101, title: "Cool T-shirt" },
  { listing_id: 102, title: "Funny Mug" },
  { listing_id: 103, title: "Funny — Mug" },
];
