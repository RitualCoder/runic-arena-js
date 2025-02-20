"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { newVerification } from "../../../actions/auth/new-verification";
import AlertMessage from "@/components/AlertMessage";
import Link from "next/link";
import Button from "@/components/Buttons/Button";

const NewVerificationPage: React.FC = () => {
  const token = useSearchParams().get("token");
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [severity, setSeverity] = useState<"success" | "error" | "warning">(
    "success"
  );

  const verifyToken = useCallback(async () => {
    if (token) {
      try {
        const res = await newVerification(token);
        if (res.error) {
          setMessage(res.error);
          setSeverity("error");
        } else {
          setMessage("Votre compte a été vérifié");
          setSeverity("success");
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setMessage("Une erreur s'est produite");
        setSeverity("error");
      }
    } else {
      setMessage("Token invalide");
      setSeverity("error");
    }
  }, [token]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">🔍 Vérification du compte</h2>
        <p className="text-sm text-gray-500 mb-6">
          Veuillez patienter pendant la vérification de votre compte...
        </p>

        {/* Message de succès ou d'erreur */}
        {message && <AlertMessage severity={severity} message={message} />}

        {/* Bouton retour à la connexion si succès */}
        {severity === "success" && (
          <Link href="/login">
            <Button size="medium" variant="primary" className="w-full mt-4">
              Se connecter
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NewVerificationPage;
