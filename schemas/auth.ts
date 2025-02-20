import * as z from "zod";

const isDevelopment = process.env.NODE_ENV === "development";

// Validation des mots de passe
const passwordValidation = isDevelopment
  ? z.string() // En développement, on accepte simplement une chaîne
  : z
      .string()
      .min(6, "Le mot de passe doit comporter au moins 6 caractères")
      .max(128, "Le mot de passe ne peut pas dépasser 128 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre")
      .regex(
        /[@$!%*?&#]/,
        "Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&#)"
      );

// Schéma pour l'inscription
export const RegisterSchema = z
  .object({
    firstname: z
      .string()
      .nonempty("Le prénom est requis")
      .min(3, "3 caractères minimum")
      .max(15, "15 caractères maximum"),
    lastname: z
      .string()
      .nonempty("Le nom est requis")
      .min(3, "3 caractères minimum")
      .max(15, "15 caractères maximum"),
    email: z
      .string()
      .nonempty("L'adresse email est requise")
      .max(255, "L'adresse email ne peut pas dépasser 255 caractères")
      .min(5, "5 caractères minimum")
      .email("Adresse email invalide"),
    password: passwordValidation.nonempty("Le mot de passe est requis"),
    confirmPassword: z
      .string()
      .nonempty("La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// Schéma pour la connexion
export const LoginSchema = z.object({
  email: z
    .string()
    .nonempty("L'adresse email est requise")
    .email("Adresse email invalide"),
  password: passwordValidation.nonempty("Le mot de passe est requis"),
});

// Schéma pour la réinitialisation ou création de mot de passe
export const NewPasswordSchema = z
  .object({
    token: z
      .string()
      .nullable(),
    password: passwordValidation.nonempty("Le mot de passe est requis"),
    confirmPassword: z
      .string()
      .nonempty("La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// Schéma pour la demande de réinitialisation de mot de passe
export const ResetPasswordSchema = z.object({
  email: z
    .string()
    .nonempty("L'adresse email est requise")
    .email("Adresse email invalide"),
});
