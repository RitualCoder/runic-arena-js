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
import Navbar from "@/components/NavBar";

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
    if (res?.error) {
      setMessage(res.error ?? "Une erreur inconnue est survenue");
      setSeverity(res.error ? "error" : "warning");
    } else {
      update();
      router.push("/");
      return;
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Inclusion du Navbar */}
      <Navbar hideUserActions />

      {/* Carré jaune (fond) */}
      <div className="absolute -top-[30%] left-[50%] h-[150%] w-[90%] bg-primary -rotate-12 z-0"></div>

      {/* Rond jaune (fond) */}
      <img
        className="absolute -bottom-[40px] -left-[40px] h-[160px] rotate-90 z-[-1]"
        src="/assets/forms/yellowRound.png"
        alt="yellow round"
      />

      {/* Formulaire */}
      <div className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-6 md:px-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border-[10px] border-primary rounded-[30px] py-8 px-10 sm:w-full max-w-md w-full relative z-10"
          noValidate
        >
          {/* Points blancs (fond) */}
          <img
            className="absolute -top-[30px] -right-[105px] h-[100px] z-[-1]"
            src="/assets/forms/whiteDots.png"
            alt="white dots"
          />

          <h1 className="font-medium mb-8 text-center text-xl sm:text-3xl">
            Se connecter
          </h1>

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

          {/* Message d'erreur éventuel */}
          {message && <AlertMessage severity={severity} message={message} />}

          {/* Bouton et lien inscription */}
          <div className="flex flex-col justify-center pt-4">
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              loading={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
            <Link
              href="/auth/register"
              className="text-secondary hover:underline text-center text-sm mt-3"
            >
              S&apos;inscrire
            </Link>
          </div>

          <div className="flex items-center w-[90%] mx-auto my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="px-4">ou</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* Vous pouvez ajouter ici le bouton de connexion via Google si nécessaire */}
          <div className="w-full flex justify-center z-10">
            <GoogleSignInButton />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
