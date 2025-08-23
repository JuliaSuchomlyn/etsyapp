import { fetchListingsTest } from "./fetchListings.js";
import { updateListing } from "./updateListing.js";

export const autoUpdateAllListings = async () => {
  const listings = await fetchListingsTest(); // або fetchListings()
  for (const listing of listings) {
    await updateListing(listing);
  }
};

// Якщо хочеш автоповтор кожні 24 години
const intervalMinutes = 60 * 24;
setInterval(autoUpdateAllListings, intervalMinutes * 60 * 1000);
