"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/auth/new-password";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas/auth";
import Link from "next/link";
import Button from "@components/Buttons/Button";
import AlertMessage from "@/components/AlertMessage";

const NewPasswordPage: React.FC = () => {
  const token = useSearchParams().get("token") ?? null;

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [severity, setSeverity] = React.useState<
    "success" | "error" | undefined
  >(undefined);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof NewPasswordSchema>) => {
    setLoading(true);
    setMessage(null);

    const res = await newPassword(data, token);

    console.log(res);

    if (res) {
      setMessage(res.error ?? res.success ?? null);
      setSeverity(res.error ? "error" : "success");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          🔑 Nouveau mot de passe
        </h2>
        <p className="text-sm text-gray-300 text-center mb-6">
          Entrez votre nouveau mot de passe pour réinitialiser votre compte.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Champ Mot de passe */}
          <div>
            <label className="block text-sm font-medium">
              Nouveau mot de passe
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <input
                  type="password"
                  {...field}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="••••••••"
                />
              )}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Champ Confirmation du mot de passe */}
          <div>
            <label className="block text-sm font-medium">
              Confirmer le mot de passe
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <input
                  type="password"
                  {...field}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="••••••••"
                />
              )}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Message de succès ou d'erreur */}
          {message && <AlertMessage severity={severity} message={message} />}

          {/* Bouton de soumission */}
          <Button
            size="medium"
            variant="primary"
            loading={loading}
            type="submit"
            className="w-full"
          >
            Réinitialiser le mot de passe
          </Button>
        </form>

        {/* Lien vers la connexion */}
        <p className="text-sm text-gray-300 text-center mt-4">
          Vous avez retrouvé votre mot de passe ?{" "}
          <Link href="/login" className="text-blue-300 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NewPasswordPage;
