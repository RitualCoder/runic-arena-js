"use server";

import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { getUserByEmail } from "../../data/user";
import { emailRegex } from "../../lib/utils";
import { RegisterSchema } from "@/schemas/auth";
import * as z from "zod";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateValues = RegisterSchema.safeParse(values);

  if (!validateValues.success) {
    return {
      error: "Données invalides ...",
    };
  }

  const { name, email, password, confirmPassword } = values;

  if (!emailRegex.test(email)) {
    return {
      error: "Email invalide",
    };
  }
  if (password !== confirmPassword) {
    return {
      error: "Les mots de passe ne correspondent pas !",
    };
  }
  if (password.length < 6) {
    return {
      error: "Le mot de passe doit contenir au moins 6 caractères",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      error: "Email déjà utilisé",
    };
  }

  const data = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  return { success: "Utilisateur créé !", data };
};
