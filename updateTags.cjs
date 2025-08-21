const runAll = require("./updateTags.js").default; // підключаємо default export

(async () => {
  try {
    await runAll();
    console.log("✅ Теги оновлені!");
  } catch (err) {
    console.error("❌ Помилка при оновленні тегів:", err);
    process.exit(1);
  }
})();
