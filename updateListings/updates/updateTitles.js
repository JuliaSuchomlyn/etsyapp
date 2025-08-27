const replaceChars = ["∙", "•", "⋆", "-", "|", "/"];
const regex = /—|[∙•⋆-|/]/;

/**
 * Оновлює один лістинг: замінює або додає символи у title
 */
const updateSingleListing = (listing) => {
  let title = listing.title;

  if (regex.test(title)) {
    title = title.replace(regex, () => replaceChars[Math.floor(Math.random() * replaceChars.length)]);
  } else if (title.length < 139) {
    title += " " + replaceChars[Math.floor(Math.random() * replaceChars.length)];
  }

  return {
    listing_id: listing.listing_id,
    title: title.trim(),
    // сюди можна додавати інші поля для Etsy: description, tags, price тощо
  };
};

/**
 * Оновлює масив лістингів і повертає новий масив для Etsy
 */
export default async function updateTitles (listings) {
  return listings.map(updateSingleListing);
};
