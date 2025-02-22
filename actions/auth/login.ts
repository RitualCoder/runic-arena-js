"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/schemas/auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateValues = LoginSchema.safeParse(values);

  if (!validateValues.success) {
    return {
      error: "Données envoyées invalides ...",
    };
  }

  const { email, password } = values;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.password || !existingUser.email) {
    return {
      error: "Email ou mot de passe incorrect !",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            error: "Email ou mot de passe incorrect !",
          };
        }
        default: {
          return {
            error: "Une erreur s'est produite !",
          };
        }
      }
    }
    throw error;
  }
};
