import { Card } from "@/types/card";

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

export const showcaseCard: Card = {
  id: "showcase-2",
  title: "Pikachu",
  type: "ELECTRIC",
  rarity: "V",
  pv: "90",
  imageUrl: "/assets/backgrounds/pika.jpg",
  description:
    "Un Pokémon électrisant connu pour ses puissantes attaques de foudre.",
  attacks: [
    {
      name: "Éclair",
      damage: "50",
      description: "Inflige 50 points de dégâts à l’adversaire.",
      cost: 2,
    },
    {
      name: "Tonnerre",
      damage: "100",
      description:
        "Inflige 100 points de dégâts et peut paralyser l’adversaire.",
      cost: 4,
    },
  ],
};
