import { autoUpdateAllListings, startAutoUpdate } from "./autoUpdateListings.js";

// Просто один раз для тесту:
await autoUpdateAllListings();

// Або запустити автоповтор кожні 5 хвилин для тесту:
startAutoUpdate(1);
