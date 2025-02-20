"use server";

import { getPasswordResetTokenByToken } from "@/data/passwordResetToken";
import { getUserByEmail } from "@/data/user";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface NewPasswordSchema {
  password: string;
  confirmPassword: string;
}

export const newPassword = async (
  values: NewPasswordSchema,
  token: string | null
) => {
  const { password, confirmPassword } = values;

  if (!token) {
    return {
      error: "Token manquant",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Les mots de passe ne correspondent pas",
    };
  }

  if (password.length < 6) {
    return {
      error: "Le mot de passe doit contenir au moins 6 caractères",
    };
  }

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return {
      error: "Token invalide",
    };
  }

  const hasExpired = new Date() > existingToken.expires;

  if (hasExpired) {
    return {
      error: "Token expiré",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      error: "Utilisateur non trouvé",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Mot de passe réinitialisé" };
};
