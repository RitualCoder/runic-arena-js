"use client";

import { deleteCard } from "@/actions/cards/delete";
import Button from "@/components/Buttons/Button";
import BasicCard from "@/components/Cards/CommonCard";
import GoldCard from "@/components/Cards/GoldCard";
import HolographicCard from "@/components/Cards/HolographicCard";
import VCard from "@/components/Cards/VCard";
import ConfirmationModal from "@/components/Modals/DeleteCard";
import NavBar from "@/components/NavBar";
import { ApiCards, getCardsByUser } from "@/data/cards";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { deleteImage } from "@/lib/storage/upload";
import { set } from "zod";
import Loading from "@/components/Templates/Loading";
import Timeout from "@/components/Templates/Timeout";

const CardsPage: React.FC = () => {
  const { data: session } = useSession();
  const [cards, setCards] = useState<ApiCards>([]);

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedCardImageURL, setSelectedCardImageURL] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  const openModal = (id: string, imageUrl: string) => {
    setSelectedCardId(id);
    setSelectedCardImageURL(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCardId(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setTimeoutReached(true);
      setLoading(false);
    }, 1500);

    const fetchCards = async () => {
      const data = await getCardsByUser();
      setCards(data);
      setLoading(false);
      clearTimeout(timeout);
    };
    fetchCards();
  }, []);

  const handleDelete = async () => {
    if (!selectedCardId || !session?.user?.id) return;

    setDeleteLoading(true);

    if (selectedCardImageURL) {
      const response = await deleteImage(selectedCardImageURL);

      if (response.error) {
        console.error(response.error);
        setError("Erreur lors de la suppression de l'image");
        return;
      }
    }

    const response = await deleteCard(selectedCardId, session.user.id);

    if (response.error) {
      console.error(response.error);
      setError("Erreur lors de la suppression de la carte");
      return;
    }

    const updatedCards = cards.filter((card) => card.id !== selectedCardId);
    setCards(updatedCards);
    setDeleteLoading(false);
    closeModal();
  };

  if (timeoutReached) {
    return <Timeout />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-dvh flex flex-col items-center z-10 relative overflow-hidden">
      {/* Fond jaune */}
      <div className="absolute -top-[30%] left-[50%] h-[155%] w-[90%] bg-primary rotate-12 z-0"></div>

      {/* Contenu principal */}
      <div className="flex items-center w-full h-full p-2 !pt-0 md:p-10 relative z-10 mt-[64px] md:mt-[73px]">
        <div className="flex flex-wrap pt-8 justify-center gap-16 w-full h-full border-[10px] rounded-[30px] border-primary bg-white overflow-y-auto no-scrollbar">
          {cards.map((card) => (
            <div
              key={card.id}
              className="card-container p-1 block w-[350px] h-[550px] mb-5"
            >
              {/* Inclusion dynamique des cartes selon leur rareté */}
              {card.rarity === "COMMON" && <BasicCard card={card} />}
              {card.rarity === "HOLOGRAPHIC" && <HolographicCard card={card} />}
              {card.rarity === "GOLD" && <GoldCard card={card} />}
              {card.rarity === "V" && <VCard card={card} />}

              {/* Boutons Modifier / Supprimer */}
              <div className="flex justify-center mt-4 gap-5">
                <Link href={`/cards/edit/${card.id}`}>
                  <Button size="small">Modifier</Button>
                </Link>
                <Button
                  onClick={() => openModal(card.id, card.imageUrl)}
                  variant="danger"
                  size="small"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
          {cards.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full h-full gap-4">
              <p className="text-center text-xl font-bold text-secondary">
                Vous n'avez pas encore de cartes
              </p>
              <Link href={`/cards/create`}>
                <Button className="flex items-center gap-2">
                  <Plus />
                  Ajouter votre première carte
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={() => handleDelete()}
        error={error}
        loading={deleteLoading}
      />
    </div>
  );
};

export default CardsPage;
