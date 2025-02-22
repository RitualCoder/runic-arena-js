import React from "react";
import { useRouter } from "next/navigation";
import Button from "../Buttons/Button";
import { RotateCcw } from "lucide-react";

const Timeout: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-73px)] text-center px-6">
      <img
        src="/assets/loaders/pikachu-timeout.png"
        alt="Erreur serveur ..."
        className="w-48"
      />
      <h1 className="text-2xl font-bold text-gray-800 mt-6">
        Oups ! Le serveur ne répond pas...
      </h1>
      <p className="text-gray-600 mt-2">
        Il semble qu'il y ait un problème de connexion. <br />
        Vérifie ta connexion ou réessaie plus tard.
      </p>
      <Button
        className="flex gap-2 items-center mt-4"
        onClick={() => window.location.reload()}
        size="small"
      >
        <RotateCcw size={14} />
        Réessayer
      </Button>
    </div>
  );
};

export default Timeout;
