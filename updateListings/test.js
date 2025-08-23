import { fetchListingsFromSheets } from "./fetchListingsFromSheets.js";

(async () => {
  const listings = await fetchListingsFromSheets();
  console.log("Отримані лістинги з Google Sheets:", listings);
})();
