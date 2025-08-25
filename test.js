import { startAutoUpdateTitles, startAutoUpdateTags } from './updateListings/modules.js';

// Тестовий запуск
startAutoUpdateTitles(1); // кожну хвилину для локального тесту
startAutoUpdateTags(0.0013889); // приблизно 2 секунди для тесту
