"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { register } from "@/actions/auth/register";
import { RegisterSchema } from "@/schemas/auth";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import AlertMessage from "@/components/AlertMessage";

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [severity, setSeverity] = React.useState<
    "success" | "error" | "warning"
  >("success");

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    setMessage(null);

    const res = await register(data);

    if (res?.error) {
      setMessage(res.error);
      setSeverity("error");
    } else {
      setMessage(res?.success || "Compte créé avec succès !");
      setSeverity("success");
      if (process.env.NODE_ENV === "development") {
        setTimeout(() => router.push("/"), 2000);
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Créer un compte
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <Controller
              name="firstname"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.firstname
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  aria-invalid={errors.firstname ? "true" : "false"}
                />
              )}
            />
            {errors.firstname && (
              <p className="mt-1 text-sm text-red-600">
                {errors.firstname.message}
              </p>
            )}
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <Controller
              name="lastname"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.lastname
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  aria-invalid={errors.lastname ? "true" : "false"}
                />
              )}
            />
            {errors.lastname && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lastname.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  type="email"
                  {...field}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              )}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
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
                  aria-invalid={errors.password ? "true" : "false"}
                />
              )}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirmation du mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
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
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
              )}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Message de succès ou d'erreur */}
          {message && <AlertMessage severity={severity} message={message} />}

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {loading ? "Création du compte..." : "Créer un compte"}
          </button>
        </form>

        {/* Lien vers connexion */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà un compte ?
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
