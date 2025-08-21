const fetch = require("node-fetch");

// Встав свої значення після активації ключа
const access_token = "<тут твій access_token>";
const shop_id = "<тут твій shop_id>";

const fetchListings = async () => {
    const url = `https://api.etsy.com/v3/application/shops/${shop_id}/listings`;
    const response = await fetch(url, {
        headers: {
            'x-api-key': '2mix1guy02w1qdhdjakvglcg',
            'Authorization': `Bearer ${access_token}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        return data.results;
    } else {
        console.log('Помилка при отриманні лістингів:', response.status, response.statusText);
        return [];
    }
};

const fetchListingsTest = async () => {
    return [
        { listing_id: 101, title: "Cool T-shirt" },
        { listing_id: 102, title: "Funny Mug" },
        { listing_id: 102, title: "Funny — Mug" },
    ];
};

const updateListing = async (listing) => {
    let title = listing.title;

    // Масив символів, на які будемо замінювати тире
    const replaceChars = ["∙", "•", "✨", "⋆", "✦", "✧", "❋", "✾"];

    // Регулярка: шукаємо довге тире або будь-який з символів, які ми раніше вставляли
    const regex = /—|[∙•✨⋆✦✧❋✾]/;

    if (regex.test(title)) {
    // Якщо знайдено тире чи наш символ → замінюємо
    title = title.replace(regex, () => replaceChars[Math.floor(Math.random() * replaceChars.length)]);
    } else {
        // Якщо нема тире чи символу
        if (title.length < 139) {
        // Можемо додати символ у кінець
        title = title + " " + replaceChars[Math.floor(Math.random() * replaceChars.length)];
        } else {
        // Якщо назва вже 139 символів → нічого не робимо
        console.log(`⚠️ Назва ${listing.listing_id} вже має 140 символів, змін не внесено`);
        }
    }

    // Тестовий режим: показуємо результат у консолі
    console.log(`[${new Date().toLocaleTimeString()}] Лістинг ${listing.listing_id} оновлено: ${title}`);

    // Якщо ключ стане активним, можна розкоментувати цей код
    /*
    const url = `https://api.etsy.com/v3/application/listings/${listing.listing_id}`;
    const body = { title: listing.title + suffix };
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'x-api-key': '2mix1guy02w1qdhdjakvglcg',
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (response.ok) {
        console.log(`Лістинг ${listing.listing_id} оновлено`);
    } else {
        console.log('Помилка при оновленні лістингу:', response.status, response.statusText);
    }
    */
};


const autoUpdateAllListings = async () => {
    const listings = await fetchListingsTest();
    //const listings = await fetchListings();
    for (const listing of listings) {
        await updateListing(listing); // передаємо увесь об’єкт, а не тільки id
    }
};

autoUpdateAllListings();

const intervalMinutes = 60 * 24; // кожні 60 * 24 хвилин
setInterval(autoUpdateAllListings, intervalMinutes * 60 * 1000); // повторюємо автоматично

//console.log(`[${new Date().toLocaleTimeString()}] Лістинг ${listing.listing_id} оновлено: ${listing.title + suffix}`);

