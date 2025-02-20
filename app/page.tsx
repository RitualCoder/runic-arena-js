"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4">
          🚀 Bienvenue sur votre template sur mesure !
        </h1>
        <p className="text-lg text-center mb-6">
          Ce projet utilise{" "}
          <span className="font-semibold">Next.js, Tailwind CSS et Prisma</span>{" "}
          pour une expérience moderne et efficace.
        </p>

        {session ? (
          <div className="text-center">
            <p className="text-lg font-medium mb-4">
              👋 Bienvenue{" "}
              <span className="text-yellow-500">{session.user?.email}</span> !
            </p>
            <button
              onClick={() => signOut()}
              className="w-full px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() => signIn()}
              className="w-full px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
            >
              Se connecter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
