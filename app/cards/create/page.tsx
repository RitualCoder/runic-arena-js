"use client";

import React, { ChangeEvent, useState } from "react";
import Navbar from "@/components/NavBar";
import BasicCard from "@/components/Cards/CommonCard";
import Button from "@/components/Buttons/Button";
import { Card } from "@/types/card";
import { Trash2, Grab } from "lucide-react";
import HolographicCard from "@/components/Cards/HolographicCard";
import VCard from "@/components/Cards/VCard";
import GoldCard from "@/components/Cards/GoldCard";
import { createCard } from "@/actions/cards/create";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/storage/upload";

interface AttackErrors {
  name?: string;
  damage?: string;
  description?: string;
  cost?: string;
}

interface FieldErrors {
  title: string;
  type: string;
  rarity: string;
  hp: string;
  description: string;
  imageUrl: string;
  attacks: AttackErrors[];
}

const defaultAttack = {
  name: "Nouvelle attaque",
  damage: "10",
  description: "Description par défaut",
  cost: 1,
};

const CreateCardPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [card, setCard] = useState<Card>({
    title: "Runic",
    type: "NORMAL",
    rarity: "COMMON",
    pv: "10",
    imageUrl: undefined,
    description: "Ceci est la description de la carte",
    attacks: [],
  });

  const [file, setFile] = useState<File | undefined>(undefined);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    title: "",
    type: "",
    rarity: "",
    hp: "",
    description: "",
    imageUrl: "",
    attacks: [],
  });

  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof Card>(field: K, value: Card[K]) => {
    setCard((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    updateField(name as keyof Card, value);

    // Réinitialiser l'erreur du champ modifié
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : undefined;
    if (file) {
      setFieldErrors((prev) => ({ ...prev, imageUrl: "" }));
      setFile(file);
      updateField("imageUrl", URL.createObjectURL(file));
    }
  };

  const handleAttackChange = (
    index: number,
    field: keyof Card["attacks"][number],
    value: string | number
  ) => {
    const newAttacks = [...card.attacks];
    if (!newAttacks[index]) {
      newAttacks[index] = { name: "", damage: "0", description: "", cost: 0 };
    }
    newAttacks[index] = { ...newAttacks[index], [field]: value };
    updateField("attacks", newAttacks);

    // Si une erreur existait sur ce champ d'attaque, on la supprime
    setFieldErrors((prev) => {
      const updatedAttacks = [...prev.attacks];
      if (!updatedAttacks[index]) updatedAttacks[index] = {};
      updatedAttacks[index][field] = "";
      return { ...prev, attacks: updatedAttacks };
    });
  };

  const addAttack = () => {
    updateField("attacks", [...card.attacks, defaultAttack]);
    setFieldErrors((prev) => ({
      ...prev,
      attacks: [...prev.attacks, {}],
    }));
  };

  const removeAttack = (index: number) => {
    updateField(
      "attacks",
      card.attacks.filter((_, i) => i !== index)
    );
    setFieldErrors((prev) => ({
      ...prev,
      attacks: prev.attacks.filter((_, i) => i !== index),
    }));
  };

  // Fonction de validation du formulaire
  const validateForm = (): boolean => {
    let isValid = true;
    const errors: FieldErrors = {
      title: "",
      type: "",
      rarity: "",
      hp: "",
      description: "",
      imageUrl: "",
      attacks: [],
    };

    if (!card.title.trim()) {
      errors.title = "Le titre est obligatoire.";
      isValid = false;
    }
    if (!card.type) {
      errors.type = "Le type est obligatoire.";
      isValid = false;
    }
    if (!card.rarity) {
      errors.rarity = "La rareté est obligatoire.";
      isValid = false;
    }
    if (!card.pv) {
      errors.hp = "Les HP sont obligatoires.";
      isValid = false;
    }
    if (!card.description.trim()) {
      errors.description = "La description est obligatoire.";
      isValid = false;
    }
    if (file && file.size > 1024 * 1024) {
      errors.imageUrl = "L'image ne doit pas dépasser 1 Mo.";
      isValid = false;
    }

    // Validation des attaques (s'il y en a)
    errors.attacks = card.attacks.map((attack) => {
      const attackError: AttackErrors = {};
      if (!attack.name.trim()) {
        attackError.name = "Le titre de l'attaque est obligatoire.";
        isValid = false;
      }
      if (!attack.damage.toString().trim()) {
        attackError.damage = "La puissance de l'attaque est obligatoire.";
        isValid = false;
      }
      if (!attack.description.trim()) {
        attackError.description =
          "La description de l'attaque est obligatoire.";
        isValid = false;
      }
      if (attack.cost < 0 || attack.cost > 4) {
        attackError.cost = "Le coût doit être entre 0 et 4.";
        isValid = false;
      }
      return attackError;
    });

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Si un fichier est sélectionné, on l'upload d'abord
      let uploadedImageUrl = card.imageUrl;
      if (file) {
        const { imageUrl, error: uploadError } = await uploadImage({
          file,
          bucket: "pokemon-images",
          folder: "",
        });
        if (uploadError) {
          setError(uploadError);
          setLoading(false);
          return;
        }
        uploadedImageUrl = imageUrl;
      }

      const cardToCreate = { ...card, imageUrl: uploadedImageUrl };

      const newCard = await createCard(cardToCreate);
      router.push("/cards");
    } catch (error) {
      console.error("Error creating card", error);
      setError("Erreur lors de la création de la carte.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-fit md:h-[100vh] w-full relative overflow-hidden">
      {/* Fond */}
      <div className="absolute top-0 right-0 h-[620px] w-full md:w-[33%] md:h-full bg-primary z-[-1]" />
      <img
        src="/assets/forms/whiteRound.png"
        alt="Rond blanc"
        className="absolute top-[300px] md:bottom-[-50px] md:top-auto right-[-50px] h-[200px] -rotate-6 z-[-1]"
      />
      <img
        src="/assets/forms/yellowDots.png"
        alt="Points jaune"
        className="absolute bottom-[-20px] left-[-20px] md:top-[-50px] md:left-[40%] h-[110px] z-[0]"
      />

      <div className="flex flex-1 pb-8 relative z-10 flex-col md:flex-row mt-[73px]">
        {/* Prévisualisation de la carte */}
        <div className="order-1 md:order-2 w-full md:w-1/3 p-4 flex justify-center items-center h-auto md:h-full">
          <div
            id="card-test"
            className="card-container p-1 w-[350px] h-auto min-w-[350px]"
          >
            {card.rarity.toLowerCase() === "common" && (
              <BasicCard card={card} display />
            )}
            {card.rarity.toLowerCase() === "holographic" && (
              <HolographicCard card={card} display />
            )}
            {card.rarity.toLowerCase() === "gold" && (
              <GoldCard card={card} display />
            )}
            {card.rarity.toLowerCase() === "v" && <VCard card={card} display />}
          </div>
        </div>

        {/* Formulaire */}
        <div className="order-2 md:order-1 mt-10 md:mt-0 w-full md:w-2/3 p-4 pl-0 flex flex-col items-center h-auto md:h-[calc(100vh-73px)] overflow-hidden overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Créer votre carte</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full px-10 max-w-[800px]"
            noValidate
          >
            {/* Nom de la carte */}
            <div>
              <label htmlFor="title" className="block">
                Nom de la carte
              </label>
              <input
                id="title"
                name="title"
                value={card.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {fieldErrors.title && (
                <span className="text-red-500 text-sm">
                  {fieldErrors.title}
                </span>
              )}
            </div>

            {/* Type de carte (select) */}
            <div>
              <label htmlFor="type" className="block">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={card.type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="FIRE">Feu</option>
                <option value="WATER">Eau</option>
                <option value="GRASS">Plante</option>
                <option value="PSYCHIC">Psy</option>
                <option value="NORMAL">Normal</option>
                <option value="ELECTRIC">Électrique</option>
                <option value="FIGHTING">Combat</option>
                <option value="DARK">Obscur</option>
                <option value="DRAGON">Dragon</option>
              </select>
              {fieldErrors.type && (
                <span className="text-red-500 text-sm">{fieldErrors.type}</span>
              )}
            </div>

            {/* Rareté (select) */}
            <div>
              <label htmlFor="rarity" className="block">
                Rareté
              </label>
              <select
                id="rarity"
                name="rarity"
                value={card.rarity}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="COMMON">Commune</option>
                <option value="HOLOGRAPHIC">Holographique</option>
                <option value="GOLD">Gold</option>
                <option value="V">V</option>
              </select>
              {fieldErrors.rarity && (
                <span className="text-red-500 text-sm">
                  {fieldErrors.rarity}
                </span>
              )}
            </div>

            {/* HP */}
            <div>
              <label htmlFor="hp" className="block">
                HP
              </label>
              <input
                id="pv"
                name="pv"
                type="number"
                value={card.pv === "" ? "" : card.pv}
                min={0}
                max={990}
                step={10}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {fieldErrors.hp && (
                <span className="text-red-500 text-sm">{fieldErrors.hp}</span>
              )}
            </div>

            {/* Image */}
            <div>
              <label htmlFor="imageFile" className="block">
                Image
              </label>
              <input
                id="imageFile"
                name="imageFile"
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {fieldErrors.imageUrl && (
                <span className="text-red-500 text-sm">
                  {fieldErrors.imageUrl}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={card.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {fieldErrors.description && (
                <span className="text-red-500 text-sm">
                  {fieldErrors.description}
                </span>
              )}
            </div>

            <hr className="h-px my-4 bg-gray-200 border-0" />

            {/* Attaques */}
            <div>
              {card.attacks.map((attack, index) => (
                <div key={index} className="mb-4 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Attaque {index + 1}</h2>
                    <Button
                      type="button"
                      onClick={() => removeAttack(index)}
                      size="small"
                      variant="danger"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  <div>
                    <label htmlFor={`attack-title-${index}`} className="block">
                      Titre de l'attaque
                    </label>
                    <input
                      id={`attack-title-${index}`}
                      value={attack.name}
                      onChange={(e) =>
                        handleAttackChange(index, "name", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {fieldErrors.attacks[index]?.name && (
                      <span className="text-red-500 text-sm">
                        {fieldErrors.attacks[index].name}
                      </span>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`attack-power-${index}`} className="block">
                      Puissance
                    </label>
                    <input
                      id={`attack-power-${index}`}
                      value={attack.damage}
                      onChange={(e) =>
                        handleAttackChange(index, "damage", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {fieldErrors.attacks[index]?.damage && (
                      <span className="text-red-500 text-sm">
                        {fieldErrors.attacks[index].damage}
                      </span>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`attack-description-${index}`}
                      className="block"
                    >
                      Description
                    </label>
                    <input
                      id={`attack-description-${index}`}
                      value={attack.description}
                      onChange={(e) =>
                        handleAttackChange(index, "description", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {fieldErrors.attacks[index]?.description && (
                      <span className="text-red-500 text-sm">
                        {fieldErrors.attacks[index].description}
                      </span>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`attack-cost-${index}`} className="block">
                      Coût
                    </label>
                    <input
                      id={`attack-cost-${index}`}
                      type="number"
                      value={attack.cost}
                      min={0}
                      max={4}
                      onChange={(e) => {
                        let value = Number(e.target.value);
                        if (value > 4) value = 4;
                        if (value < 0) value = 0;
                        handleAttackChange(index, "cost", value);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    {fieldErrors.attacks[index]?.cost && (
                      <span className="text-red-500 text-sm">
                        {fieldErrors.attacks[index].cost}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {card.attacks.length < 2 && (
                <div className="flex justify-center w-full my-2">
                  <Button
                    className="flex gap-2"
                    onClick={addAttack}
                    variant="secondary"
                    size="small"
                    type="button"
                  >
                    <Grab />
                    Ajouter une attaque
                  </Button>
                </div>
              )}
            </div>

            <hr className="w-full border-solid my-2" />

            {/* Message d'erreur */}
            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}

            {/* Bouton de validation */}
            <Button
              type="submit"
              className="w-full my-4"
              loading={loading}
              disabled={loading}
            >
              {loading ? "Création en cours..." : "Créer ma carte"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCardPage;
