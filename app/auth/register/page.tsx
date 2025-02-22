"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { register as registerAction } from "@/actions/auth/register";
import { RegisterSchema } from "@/schemas/auth";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import AlertMessage from "@/components/AlertMessage";
import Navbar from "@/components/NavBar";
import Button from "@/components/Buttons/Button";

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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    setMessage(null);

    const res = await registerAction(data);

    if (res?.error) {
      setMessage(res.error);
      setSeverity("error");
    } else {
      setMessage(res?.success || "Compte créé avec succès !");
      setSeverity("success");
      setTimeout(() => router.push("/auth/login"), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Carré jaune (fond) */}
      <div className="absolute -top-[30%] right-[50%] h-[150%] w-[90%] bg-primary rotate-12"></div>

      {/* Rond jaune (fond) */}
      <img
        className="absolute -bottom-[40px] -right-[40px] h-[160px]"
        src="/assets/forms/yellowRound.png"
        alt="yellow round"
      />

      {/* Formulaire */}
      <div className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-6 md:px-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="bg-white border-[10px] border-primary rounded-[30px] py-8 px-6 md:px-10 max-w-sm w-full relative z-10"
        >
          {/* Points blancs (fond) */}
          <img
            className="absolute -top-[30px] -left-[105px] h-[100px] z-[-1]"
            src="/assets/forms/whiteDots.png"
            alt="white dots"
          />

          <h1 className="font-medium mb-8 text-center text-xl sm:text-3xl">
            Créer un compte
          </h1>

          {/* Champ Nom */}
          <div className="mb-4">
            <label
              htmlFor="lastname"
              className="block text-gray-800 font-bold mb-1 text-sm"
            >
              Pseudo
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  id="lastname"
                  {...field}
                  className={`w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none transition duration-200 ease-in-out ${
                    errors.name ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  aria-invalid={errors.name ? "true" : "false"}
                  required
                />
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Champ Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-800 font-bold mb-1 text-sm"
            >
              Email
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  type="email"
                  id="email"
                  {...field}
                  className={`w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none transition duration-200 ease-in-out ${
                    errors.email ? "border-red-500 focus:ring-red-500" : ""
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
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-800 font-bold mb-1 text-sm"
            >
              Mot de passe
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <input
                  type="password"
                  id="password"
                  {...field}
                  className={`w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none transition duration-200 ease-in-out ${
                    errors.password ? "border-red-500 focus:ring-red-500" : ""
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

          {/* Champ Confirmation du mot de passe */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-800 font-bold mb-1 text-sm"
            >
              Confirmer le mot de passe
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <input
                  type="password"
                  id="confirmPassword"
                  {...field}
                  className={`w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none transition duration-200 ease-in-out ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  required
                />
              )}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="my-2">
            {/* Message de succès ou d'erreur */}
            {message && <AlertMessage severity={severity} message={message} />}
          </div>

          {/* Bouton de soumission */}
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            variant="primary"
            className="w-full mt-4"
          >
            {loading ? "Création du compte..." : "Créer un compte"}
          </Button>

          {/* Lien vers la page de connexion */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
