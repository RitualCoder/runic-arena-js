"use server";

import * as z from "zod";
import { getUserByEmail } from "@/data/user";
import { emailRegex } from "@/lib/utils";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetPasswordSchema } from "@/schemas/auth";

export const reset = async (values: z.infer<typeof ResetPasswordSchema>) => {
  const validateValues = ResetPasswordSchema.safeParse(values);

  if (!validateValues.success) {
    return {
      error: "Données invalides ...",
    };
  }

  const { email } = values;

  if (!emailRegex.test(email)) {
    return {
      error: "Email invalide !",
    };
  }

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      error: "Email non trouvé !",
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  return { success: "Email de réinitialisation envoyé !" };
};
