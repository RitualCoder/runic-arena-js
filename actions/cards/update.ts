"use server";

import { prisma } from "@/lib/prisma";
import { Card } from "@/types/card";
import { auth } from "@/auth";

export const updateCard = async (values: Card) => {
  const session = await auth();

  if (!session?.user || !session?.user?.id) {
    return { error: "Aucune session trouvée" };
  }

  const userId = session.user.id;

  const { title, type, rarity, pv, imageUrl, description, attacks } = values;

  if (!title || !type || !rarity || !pv || !description || !attacks) {
    return { error: "Veuillez remplir tous les champs" };
  }

  const updatedCard = await prisma.card.update({
    where: {
      id: values.id,
    },
    data: {
      userId,
      title,
      pv: parseInt(pv),
      description,
      rarity,
      type,
      imageUrl: imageUrl || "",
      attacks: {
        deleteMany: {},
        create: attacks.map((attack) => ({
          name: attack.name,
          damage: parseInt(attack.damage) || 0,
          cost: attack.cost,
          description: attack.description,
        })),
      },
    },
  });

  return { data: updatedCard };
};
