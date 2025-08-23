import { fetchListingsFromSheets } from "./fetchListingsFromSheets.js";
import { updateListing } from "./updateListing.js";

(async () => {
  const listings = await fetchListingsFromSheets();
  console.log("Отримані лістинги з Google Sheets:", listings);

  const updatedListings = await updateListing(listings);
  console.log("Оновлені лістинги для Etsy:", updatedListings);
})();
