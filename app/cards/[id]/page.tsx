"use client";

import BasicCard from "@/components/Cards/CommonCard";
import GoldCard from "@/components/Cards/GoldCard";
import HolographicCard from "@/components/Cards/HolographicCard";
import VCard from "@/components/Cards/VCard";
import Loading from "@/components/Templates/Loading";
import Timeout from "@/components/Templates/Timeout";
import { getCardById } from "@/data/cards";
import { Card } from "@/types/card";
import React, { useEffect, useState } from "react";

interface PageProps {
  // Note : params est maintenant une Promise
  params: Promise<{ id: string }>;
}

const Page: React.FC<PageProps> = ({ params }) => {
  // Déballer la promise avec React.use()
  const { id } = React.use(params);

  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchCard() {
      try {
        const card = await getCardById(id);
        if (!card) {
          console.error("Card not found");
          setError("Carte non trouvée");
          return;
        }
        setCard({
          ...card,
          title: card.title,
          type: card.type,
          rarity: card.rarity,
          pv: card.pv.toString(),
          imageUrl: card.imageUrl,
          description: card.description,
          attacks: card.attacks.map((attack) => ({
            ...attack,
            damage: attack.damage.toString(),
          })),
        });
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement de la carte");
      } finally {
        setLoading(false);
      }
    }

    fetchCard();
  }, [id]);

  if (loading) return <Loading />;
  if (error || !card) return <Timeout />;

  return (
    <div className="p-4 h-dvh w-full flex justify-center items-center">
      <div
        className="card-container p-1 block w-[350px] h-[550px] my-[-50px] md:my-[-20px] scale-75 md:scale-100"
      >
        {card.rarity === "COMMON" && <BasicCard card={card} />}
        {card.rarity === "HOLOGRAPHIC" && <HolographicCard card={card} />}
        {card.rarity === "GOLD" && <GoldCard card={card} />}
        {card.rarity === "V" && <VCard card={card} />}
      </div>
    </div>
  );
};

export default Page;
