// autoUpdateListings.js
import { fetchListingsFromSheets } from "./fetchListingsFromSheets.js";
import { updateListing } from "./updateListing.js";

/**
 * Запускає оновлення всіх лістингів
 */
export const autoUpdateAllListings = async () => {
  const listings = await fetchListingsFromSheets();
  const updatedListings = await updateListing(listings);

  console.log("Оновлені лістинги для Etsy:", updatedListings);

  return updatedListings; // якщо потрібно далі використовувати
};

/**
 * Автозапуск кожні N хвилин
 * (для тесту можна поставити невелике значення, наприклад 1 хв)
 */
export const startAutoUpdate = (intervalMinutes = 1440) => { // 1440 хв = 24 години
  autoUpdateAllListings(); // одразу виконуємо один раз
  setInterval(autoUpdateAllListings, intervalMinutes * 60 * 1000);
};
