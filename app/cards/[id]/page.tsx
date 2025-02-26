"use client";

import BasicCard from "@/components/Cards/CommonCard";
import GoldCard from "@/components/Cards/GoldCard";
import HolographicCard from "@/components/Cards/HolographicCard";
import VCard from "@/components/Cards/VCard";
import Loading from "@/components/Templates/Loading";
import Timeout from "@/components/Templates/Timeout";
import { ApiCard, getCardById } from "@/data/cards";
import React, { useEffect, useState } from "react";
import { CloudDownload, Share, CopyCheck } from "lucide-react";
import Button from "@/components/Buttons/Button";
import domtoimage from "dom-to-image";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page: React.FC<PageProps> = ({ params }) => {
  const { id } = React.use(params);
  const [card, setCard] = useState<ApiCard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCard() {
      try {
        const card = await getCardById(id);
        if (!card) {
          console.error("Card not found");
          setError("Carte non trouvée");
          return;
        }
        setCard(card);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement de la carte");
      } finally {
        setLoading(false);
      }
    }
    fetchCard();
  }, [id]);

  // Fonction pour capturer et télécharger l'image de la carte
  const downloadCardAsImage = async () => {
    const cardElement = document.getElementById("download-card");
    if (!cardElement) {
      console.error("Élément non trouvé !");
      return;
    }

    const scale = 2;

    try {
      const blob = await domtoimage.toBlob(cardElement, {
        width: cardElement.clientWidth * scale,
        height: cardElement.clientHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        },
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `carte-${card?.id || "download"}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de la capture de l'image :", error);
    }
  };

  if (loading) return <Loading />;
  if (error || !card) return <Timeout />;

  return (
    <div className="h-screen flex flex-col items-center z-10 relative overflow-hidden">
      {/* Fond jaune */}
      <div className="absolute -top-[30%] left-[50%] h-[155%] w-[90%] bg-primary rotate-12 z-0"></div>

      {/* Contenu principal */}
      <div className="flex flex-col w-full h-dvh p-2 !pt-0 md:p-10 relative z-10 mt-[80px] md:mt-[90px] min-w-[400px] items-center">
        <div
          id="download-card"
          className="card-container p-1 block w-[350px] h-fit scale-75 md:scale-100"
        >
          {card.rarity === "COMMON" && <BasicCard card={card} />}
          {card.rarity === "HOLOGRAPHIC" && <HolographicCard card={card} />}
          {card.rarity === "GOLD" && <GoldCard card={card} />}
          {card.rarity === "V" && <VCard card={card} />}
        </div>
        <div className="flex flex-col items-center gap-2 w-[300px] md:w-[350px] h-auto md:mt-6 bg-white border-solid border-primary border-4 rounded-lg p-4">
          🎨 Créateur : {card.user.name}
          <div className="flex w-full justify-center gap-2 mt-2">
            <Button
              size="small"
              startIcon={<CloudDownload />}
              onClick={downloadCardAsImage}
            >
              Télécharger
            </Button>
            <Button
              size="small"
              startIcon={copiedUrl ? <CopyCheck /> : <Share />}
              variant={copiedUrl ? "secondary" : "primary"}
              onClick={() => {
                if (!copiedUrl) {
                  navigator.clipboard
                    .writeText(window.location.href)
                    .then(() => {
                      setCopiedUrl(true);
                      setTimeout(() => setCopiedUrl(false), 3000);
                    })
                    .catch((err) =>
                      console.error("Erreur lors de la copie de l'URL :", err)
                    );
                }
              }}
            >
              {copiedUrl ? "Url copié" : "Partager"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
