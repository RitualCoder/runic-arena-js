"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/Buttons/Button";
import { reset as resetPassword } from "@/actions/auth/reset";
import AlertMessage from "@/components/AlertMessage";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/schemas/auth";

const ResetPasswordPage: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [severity, setSeverity] = React.useState<
    "success" | "error" | "warning" | undefined
  >(undefined);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
    setLoading(true);
    setMessage(null);

    const res = await resetPassword(data);

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
          🔒 Réinitialisation du mot de passe
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Entrez votre adresse email pour recevoir un lien de réinitialisation.
        </p>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <input
              type="email"
              {...control.register("email")}
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="exemple@domaine.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Message de succès ou d'erreur */}
          {message && <AlertMessage severity={severity} message={message} />}

          {/* Bouton d'envoi */}
          <Button
            type="submit"
            size="medium"
            variant="primary"
            loading={loading}
            className="w-full"
          >
            Envoyer le lien de réinitialisation
          </Button>
        </form>

        {/* Lien retour connexion */}
        <p className="text-sm text-gray-500 text-center mt-4">
          <a href="/login" className="text-blue-500 hover:underline">
            Retour à la connexion
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
