"use server";

import { prisma } from "@lib/prisma";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting user by email", error);
    return null;
  }
};

export const getUserById = async (
  id: string,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting user by id", error);
    return null;
  }
};