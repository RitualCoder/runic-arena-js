import React, { useState, useRef } from "react";
import { Card } from "@/types/card";
import { useCardInteractions } from "@/hooks/useCardInteractions";

interface VCardProps {
  card: Card;
  display?: boolean;
}

const VCard: React.FC<VCardProps> = ({ card, display = true }) => {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useCardInteractions(cardRef);

  const handleClick = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) return;
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  // On utilise card.type.toLowerCase() pour les chemins d'images d'énergie
  const cardTypeLower = card.type.toLowerCase();

  return (
    <div
      ref={cardRef}
      id="card-v"
      onClick={handleClick}
      className={`card ${!display ? "hidden" : ""} ${
        expanded ? "expanded" : ""
      }`}
    >
      <div
        className={`card-content relative overflow-hidden ${
          card.type.toLowerCase() === "dark" ? "text-white" : "text-black"
        }`}
      >
        {/* Type de la carte : image statique pour V */}
        <img
          src="/assets/template_cards/v.png"
          alt="v.png"
          className="relative z-10 w-full h-auto user-drag-none"
        />

        {/* Nom de la carte */}
        <div className="absolute w-[165px] overflow-hidden flex items-center font-GillSans font-sem z-20 top-[14px] left-[68px] text-[23px] h-[30px] text-stroke line">
          <p className="leading-none">{card.title}</p>
          <img src="/assets/icons/v.webp" className="h-[25px]" alt="v-icon" />
        </div>

        {/* PV */}
        <p className="absolute font-GillSans font-bold z-20 top-[7px] right-[48px] text-[8px] tracking-tighter text-white">
          PV
          <span className="text-[28px] font-GillSans font-sem tracking-tighter">
            {card.pv}
          </span>
        </p>

        {/* Energie */}
        <div className="absolute top-[15.6px] right-[15.6px] z-10 w-[28px] h-[28px]">
          <img
            id="card-energy-display"
            src={`/assets/energies/${cardTypeLower}.png`}
            alt="energy.png"
          />
        </div>

        {/* Image du Pokémon */}
        <div className="absolute top-0 p-[12px] h-full w-full bg-transparent user-drag-none">
          <img
            draggable="false"
            src={
              card.imageUrl ? card.imageUrl : "/assets/backgrounds/runicBg.jpg"
            }
            alt="Image carte"
            className="card-img h-full w-full object-cover"
          />
        </div>

        {/* Attaques de la carte */}
        <div
          className="flex justify-center flex-col gap-3 items-center absolute z-20 bottom-[74px] left-[24px] h-[160px] w-[295px] p-1"
          data-energy={cardTypeLower}
        >
          {card.attacks.map((attack, index) => (
            <div key={index} className="flex flex-col w-full">
              <div className="flex justify-between w-full align-baseline">
                <div className="flex items-center gap-2">
                  <div className={`flex w-[80px] items-center gap-[2px]`}>
                    {attack.cost > 0 &&
                      Array.from({ length: attack.cost }, (_, i) => (
                        <div
                          key={i}
                          className="relative w-[17.5px] h-[17.5px] rounded-full bg-white flex justify-center items-center"
                        >
                          <img
                            src={`/assets/energies/${cardTypeLower}.png`}
                            alt="energy.png"
                            className="atk-energy w-[17.5px] h-[17.5px] rounded-full"
                          />
                        </div>
                      ))}
                  </div>
                  <p
                    className={`font-GillSans font-sem text-[18px] leading-[18px] text-stroke`}
                  >
                    {attack.name}
                  </p>
                </div>
                <p
                  className={`font-GillSans font-semibold text-[17px] leading-[18px] tracking-tighter text-stroke`}
                >
                  {attack.damage}
                </p>
              </div>
              <p
                className={`font-GillSans font-medium text-[10px] text-stroke mt-1 break-words leading-none`}
              >
                {attack.description}
              </p>
            </div>
          ))}
        </div>

        {/* Faiblesse */}
        <div className="absolute font-GillSans z-20 bottom-[54.5px] left-[20px] w-[160px] text-[7px] items-center">
          <p className="text-white">Faiblesse</p>
        </div>

        {/* Résistance */}
        <div className="absolute font-GillSans z-20 bottom-[54.5px] left-[107px] text-[7px] items-center overflow-hidden">
          <p className="text-white">Résistance</p>
        </div>

        {/* Retraite */}
        <div className="absolute font-GillSans flex z-20 bottom-[54.5px] left-[210px] text-[7px] items-center overflow-hidden gap-1">
          <p className="text-white">Retraite</p>
          <img
            src={`/assets/energies/${cardTypeLower}.png`}
            alt="energy.png"
            className="w-[12px] h-[12px] rounded-full"
          />
        </div>

        {/* Illustration */}
        <div className="absolute flex flex-col z-20 bottom-[20px] left-[20px] text-black text-stroke-sm gap-[2px]">
          <p className="w-full font-GillSans font-medium text-[6px] leading-[6px]">
            Illus. Runic Arena
          </p>
          <p className="text-[7px] flex items-center">
            001/151 <span className="text-[4px] text-white ml-1">★</span>
          </p>
        </div>

        {/* Credits */}
        <div className="absolute z-10 bottom-[4px] left-0 w-full">
          <p className="w-full font-GillSans font-medium text-[6px] leading-[6px] text-white text-center">
            ©{new Date().getFullYear()} Pokemon / Nintendo / Creatures / GAME
            FREAK
          </p>
        </div>

        {/* Shine effects + glare */}
        <div className="effects absolute top-0 left-0 w-full h-full">
          <div className="shine rare-holo z-20 absolute h-full w-full top-0 bg-transparent"></div>
          <div className="absolute w-full h-full z-30"></div>
        </div>
      </div>
    </div>
  );
};

export default VCard;
