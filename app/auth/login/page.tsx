"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { login } from "@/actions/auth/login";
import { LoginSchema } from "@/schemas/auth";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/Buttons/Button";
import AlertMessage from "@/components/AlertMessage";
import Link from "next/link";
import GoogleSignInButton from "@/components/Buttons/GoogleLoginButton";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { update } = useSession();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [severity, setSeverity] = React.useState<
    "success" | "error" | "warning"
  >("success");

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);

    const res = await login(data);

    if (res?.error || res?.warning) {
      setMessage(
        res.error ?? res.warning ?? "Une erreur inconnue est survenue"
      );
      setSeverity(res.error ? "error" : "warning");
    } else {
      update();
      router.push("/");
      return;
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Connexion</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Champ Email */}
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
                  required
                />
              )}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Champ Mot de passe */}
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
                  required
                />
              )}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Lien "Mot de passe oublié ?" */}
          <div className="text-right">
            <a
              href="/auth/reset-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>

          {/* Message de succès ou d'erreur */}
          {message && <AlertMessage severity={severity} message={message} />}

          {/* Bouton Submit */}
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            loading={loading}
            className="w-full"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        {/* Lien vers la page de création de compte */}
        <div className="text-center mt-2">
          <Link href="/auth/register">
            <button className="text-sm text-blue-500 hover:underline">
              Créer un compte
            </button>
          </Link>
        </div>

        <div className="flex items-center w-[90%] mx-auto my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="px-4">ou</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <GoogleSignInButton />
      </div>
    </div>
  );
};

export default LoginPage;
