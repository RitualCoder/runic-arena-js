// Email validation regex pattern (simple version)
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password validation regex pattern (simple version)
export const passwordRegex = /^[a-zA-Z0-9]{6,}$/;

/**
 * Slugify a string, without duplication check.
 * @param {string} s A string.
 * @return {string} The string formatted as a slug.
 */
export const slugify = (s: string): string => {
  return s
    .normalize("NFD") // Normalisation Unicode pour séparer les caractères diacritiques
    .replace(/[\u0300-\u036f]/g, "") // Suppression des caractères diacritiques
    .toLowerCase() // Passage en minuscules
    .replaceAll(/[ ']/g, "-") // Remplace les espaces et les apostrophes par des tirets
    .replaceAll("/", "-") // Remplace les barres obliques par des tirets
    .replaceAll(/[^a-z0-9-]/g, "") // Supprime les caractères non alphanumériques sauf les tirets
    .replaceAll(/-{2,}/g, "-") // Remplace plusieurs tirets consécutifs par un seul
    .replaceAll(/^-|-$/g, ""); // Supprime les tirets au début ou à la fin de la chaîne
};

export function capitalizeFirstLetter(val: string) {
  const value = String(val).toLowerCase();
  return value.charAt(0).toUpperCase() + value.slice(1);
}
