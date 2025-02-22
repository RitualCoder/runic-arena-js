"use server";

import { Card } from "@/types/card";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { parse } from "path";

export const createCard = async (values: Card) => {
  const session = await auth();

  if (!session?.user || !session?.user?.id) {
    throw new Error("Non autorisé");
  }

  const userId = session.user.id;

  const { title, type, rarity, pv, imageUrl, description, attacks } = values;

  if (!title || !type || !rarity || !pv || !description || !attacks) {
    return { error: "Veuillez remplir tous les champs" };
  }

  const createdCard = await prisma.card.create({
    data: {
      userId,
      title,
      pv: parseInt(pv),
      description,
      rarity,
      type,
      imageUrl: imageUrl || "",
      attacks: {
        create: attacks.map((attack) => ({
          name: attack.name,
          damage: attack.damage || 0,
          cost: attack.cost,
          description: attack.description,
        })),
      },
    },
  });

  return createdCard;
};
