"use server";

import { prisma } from "@lib/prisma";
import { auth } from "@/auth";

export const getCardsByUser = async () => {
  const session = await auth();

  if (!session?.user || !session?.user?.id) {
    throw new Error("Non autorisé");
  }

  const userId = session.user.id;

  const cards = await prisma.card.findMany({
    where: {
      userId,
    },
    include: {
      attacks: true,
    },
  });

  return cards;
};

export type ApiCards = Awaited<ReturnType<typeof getCardsByUser>>;

export const getCardById = async (id: string) => {
  const card = await prisma.card.findUnique({
    where: {
      id,
    },
    include: {
      attacks: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return card;
};

export type ApiCard = Awaited<ReturnType<typeof getCardById>>;
