"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/storage/upload";

export const deleleUser = async () => {
  const session = await auth();

  if (!session?.user || !session?.user?.id) {
    return { error: "Non autorisé" };
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      cards: true,
    },
  });

  if (!user) {
    return { error: "Utilisateur non trouvé" };
  }

  for (const card of user.cards) {
    if (card.imageUrl) {
      deleteImage(card.imageUrl);
    }
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return { success: true };
};
