/**
 * Генерує декілька варіантів назв для товару на основі базової назви та ключових змінних.
 * @param {Object} product - Дані товару { baseName, material, color, occasion, style }
 * @returns {Array} - Масив назв
 */
function generateProductTitles(product) {
  const { baseName, material, color, occasion, style } = product;

  // Випадкові перестановки ключових елементів
  const templates = [
    `${baseName} - ${material}, ${color}`,
    `${material} ${baseName} for ${occasion}`,
    `${baseName}, ${style} ${material}`,
    `${color} ${material} ${baseName}`,
    `${baseName} | Perfect ${occasion}`
  ];

  return templates;
}

// Експорт для використання в інших файлах
module.exports = generateProductTitles;
