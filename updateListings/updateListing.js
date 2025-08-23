export const updateListing = async (listing) => {
  const replaceChars = ["∙", "•", "✨", "⋆", "✦", "✧", "❋", "✾"];
  let title = listing.title;
  const regex = /—|[∙•✨⋆✦✧❋✾]/;

  if (regex.test(title)) {
    title = title.replace(regex, () => replaceChars[Math.floor(Math.random() * replaceChars.length)]);
  } else if (title.length < 139) {
    title += " " + replaceChars[Math.floor(Math.random() * replaceChars.length)];
  }

  console.log(`[${new Date().toLocaleTimeString()}] Лістинг ${listing.listing_id} оновлено: ${title}`);

  // Тут можна підключити PUT-запит до Etsy, коли ключ буде активний
};
