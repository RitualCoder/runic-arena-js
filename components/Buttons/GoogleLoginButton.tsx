"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { GoogleIcon } from "../BrandIcons";

const GoogleSignInButton = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="flex items-center justify-center w-full p-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-100 transition disabled:bg-gray-200"
    >
      {loading ? (
        <span className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></span>
      ) : (
        <div className="flex gap-4 items-center justify-center">
          <GoogleIcon />
          <span>Se connecter avec Google</span>
        </div>
      )}
    </button>
  );
};

export default GoogleSignInButton;
