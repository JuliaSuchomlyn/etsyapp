// Імпортуємо бібліотеку express
const express = require('express');

// Створюємо новий додаток Express
const app = express();

// Відповідь на головну сторінку
//app.get('/', (req, res) => {
//    res.send('Hello, world!');
//});

app.set("view engine", "hbs");
app.set("views", `${process.cwd()}/views`);

app.get('/', async (req, res) => {
    res.render("index"); // тепер рендеримо index.hbs
});

// Тестовий ping до Etsy API
app.get('/ping', async (req, res) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'x-api-key': '2mix1guy02w1qdhdjakvglcg', // твій keystring
        },
    };

    try {
        const response = await fetch(
            'https://api.etsy.com/v3/application/openapi-ping',
            requestOptions
        );

        if (response.ok) {
            const data = await response.json();
            res.send(data); // Відповідь від Etsy API
        } else {
            res.send(`Oops, status: ${response.status}`);
        }
    } catch (error) {
        res.send(`Error: ${error}`);
    }
});

const clientVerifier = "PASTE_YOUR_CODE_VERIFIER_HERE";
const redirectUri = "http://localhost:3003/oauth/redirect";

app.get("/oauth/redirect", async (req, res) => {
    const authCode = req.query.code;
    const tokenUrl = 'https://api.etsy.com/v3/public/oauth/token';
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: '2mix1guy02w1qdhdjakvglcg',
            redirect_uri: redirectUri,
            code: authCode,
            code_verifier: clientVerifier,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const response = await fetch(tokenUrl, requestOptions);
    if (response.ok) {
        const tokenData = await response.json();
        res.send(tokenData); // тут отримаєш access_token
    } else {
        res.send("Oops, помилка авторизації");
    }
});



// Запускаємо сервер на порту 3003
const port = 3003;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
