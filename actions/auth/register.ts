"use server";

import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { getUserByEmail } from "../../data/user";
import { emailRegex } from "../../lib/utils";
import { generateVerificationToken } from "../../lib/tokens";
import { sendVerificationEmail } from "../../lib/mail";
import { RegisterSchema } from "@/schemas/auth";
import * as z from "zod";
import { signIn } from "@/auth";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateValues = RegisterSchema.safeParse(values);

  if (!validateValues.success) {
    return {
      error: "Données invalides ...",
    };
  }

  const { firstname, lastname, email, password, confirmPassword } = values;

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

  // Bypass email verification
  // const isDevelopment = process.env.NODE_ENV === "development";
  const isDevelopment = false;

  await prisma.user.create({
    data: {
      firstname,
      lastname,
      email,
      password: hashedPassword,
      emailVerified: isDevelopment ? new Date() : null,
    },
  });

  if (isDevelopment) {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/",
    });

    return { success: "Utilisateur créé !" };
  }

  const verificationToken = await generateVerificationToken(email);
  const emailResponse = await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token
  );

  if (emailResponse.error) {
    return { error: "Erreur lors de l'envoi de l'email" };
  }

  return { success: "Email de confirmation envoyé !" };
};
