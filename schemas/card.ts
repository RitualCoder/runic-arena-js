import { z } from "zod";
import { CardType, Rarity } from "@prisma/client";

export const CardSchema = z.object({
  title: z.string().min(1, { message: "Le nom de la carte est requis" }),
  type: z.nativeEnum(CardType, {
    errorMap: () => ({ message: "Le type est obligatoire" }),
  }),
  rarity: z.nativeEnum(Rarity, {
    errorMap: () => ({ message: "La rareté est obligatoire" }),
  }),
  hp: z.preprocess(
    (a) => Number(a),
    z
      .number({ invalid_type_error: "La valeur HP doit être un nombre" })
      .min(1, { message: "HP doit être supérieur à 0" })
  ),
  imageFile: z.any().optional(),
  description: z.string().min(1, { message: "La description est requise" }),
  attacks: z
    .array(
      z.object({
        title: z
          .string()
          .min(1, { message: "Le titre de l'attaque est requis" }),
        power: z
          .string()
          .min(1, { message: "La puissance de l'attaque est requise" }),
        description: z
          .string()
          .min(1, { message: "La description de l'attaque est requise" }),
        cost: z.preprocess(
          (a) => Number(a),
          z
            .number({ invalid_type_error: "Le coût doit être un nombre" })
            .min(0, { message: "Le coût ne peut pas être négatif" })
        ),
      })
    )
    .max(2, { message: "Maximum 2 attaques autorisées" }),
});
