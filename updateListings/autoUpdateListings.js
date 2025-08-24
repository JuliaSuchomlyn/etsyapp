import { fetchListingsFromSheets } from "./fetchListingsFromSheets.js";
import { updateTitles } from "./updateTitles.js";
import { updateTags } from "./updateTags.js";

// Фейкова відправка на Etsy для тесту
const fakeEtsyPush = async (listing) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      //console.log(`✅ Лістинг ${listing.listing_id} успішно оновлено`);
      resolve(listing);
    }, 200);
  });
};

/**
 * Автооновлення тайтлів
 */
export const autoUpdateTitles = async () => {
  const listings = await fetchListingsFromSheets();
  const updatedListings = await updateTitles(listings);

  console.log("Оновлені тайтли:", updatedListings);

  // Відправка пакетами по 5 лістингів
  const batchSize = 5;
  for (let i = 0; i < updatedListings.length; i += batchSize) {
    const batch = updatedListings.slice(i, i + batchSize);
    await Promise.all(batch.map(fakeEtsyPush));
  }
};

/**
 * Автоповтор оновлення тайтлів
 */
export const startAutoUpdateTitles = (intervalMinutes = 1440) => {
  autoUpdateTitles(); // одразу
  setInterval(autoUpdateTitles, intervalMinutes * 60 * 1000);
};

/**
 * Автооновлення тегів
 */
export const autoUpdateTags = async () => {
  const updatedListings = await updateTags();

  console.log("Оновлені теги:", updatedListings);

  const batchSize = 5; // або інший розмір пакетів
  for (let i = 0; i < updatedListings.length; i += batchSize) {
    const batch = updatedListings.slice(i, i + batchSize);
    await Promise.all(batch.map(fakeEtsyPush));
  }
};

/**
 * Автоповтор оновлення тегів
 */
export const startAutoUpdateTags = (intervalDays = 14) => {
  autoUpdateTags(); // одразу
  setInterval(autoUpdateTags, intervalDays * 24 * 60 * 60 * 1000);
};
