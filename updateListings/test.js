import { startAutoUpdateTitles, startAutoUpdateTags } from "./autoUpdateListings.js";

// Тестовий запуск
startAutoUpdateTitles(1); // кожну хвилину для локального тесту
startAutoUpdateTags(0.0013889); // тестовий інтервал для тегів (наприклад, ~15 хв)
