// updateTags.cjs
(async () => {
  try {
    const { runAll } = await import("./updateTags.js"); 
    await runAll();
    console.log("✅ Теги оновлені!");
  } catch (err) {
    console.error("❌ Помилка при оновленні тегів:", err);
    process.exit(1);
  }
})();
