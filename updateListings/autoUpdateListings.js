import { fetchListingsFromSheets } from "./fetchListingsFromSheets.js";
import { updateTitles } from "./updateTitles.js";

// Фейкова відправка на Etsy для тесту
const fakeEtsyPush = async (listing) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`✅ Лістинг ${listing.listing_id} успішно оновлено: ${listing.title}`);
      resolve(listing);
    }, 200); // пауза 200ms
  });
};

/**
 * Основне оновлення всіх лістингів
 */
export const autoUpdateTitles = async () => {
  const listings = await fetchListingsFromSheets();
  const updatedListings = await updateTitles(listings);

  console.log("Оновлені лістинги:", updatedListings);

  // Відправка пакетами по 5 лістингів
  const batchSize = 5;
  for (let i = 0; i < updatedListings.length; i += batchSize) {
    const batch = updatedListings.slice(i, i + batchSize);
    await Promise.all(batch.map(fakeEtsyPush));
  }
};

/**
 * Автоповтор оновлення
 * @param {number} intervalMinutes - інтервал у хвилинах
 */
export const startAutoUpdate = (intervalMinutes = 1440) => {
  // Одноразово одразу
  autoUpdateTitles();

  // Потім кожні intervalMinutes
  setInterval(autoUpdateTitles, intervalMinutes * 60 * 1000);
};
