"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const deleteCard = async (cardId: string, cardUserId: string) => {
  const session = await auth();

  if (!session?.user || !session?.user?.id) {
    return { error: "Non autorisé" };
  }

  const userId = session.user.id;

  if (userId !== cardUserId) {
    return {
      error: "T'es pas sérieux toi à supprimer les cartes des autres ...",
    };
  }

  const deletedCard = await prisma.card.delete({
    where: {
      id: cardId,
    },
  });

  return { data: deletedCard };
};
