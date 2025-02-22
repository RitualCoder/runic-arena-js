// types/card.ts
export interface Attack {
  name: string;
  damage: number;
  description: string;
  cost: number;
}

export type CardType =
  | "FIRE"
  | "WATER"
  | "GRASS"
  | "PSYCHIC"
  | "NORMAL"
  | "ELECTRIC"
  | "FIGHTING"
  | "DARK"
  | "DRAGON";

export type Rarity = "COMMON" | "HOLOGRAPHIC" | "GOLD" | "V";

export interface Card {
  id?: string;
  title: string;
  type: CardType;
  rarity: Rarity;
  pv: string;
  imageUrl?: string;
  description: string;
  attacks: Attack[];
}
