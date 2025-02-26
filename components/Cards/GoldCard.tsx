import React, { useState, useRef } from "react";
import { Card } from "@/types/card";
import { useCardInteractions } from "@/hooks/useCardInteractions";

interface GoldCardProps {
  card: Card;
  display?: boolean;
}

const GoldCard: React.FC<GoldCardProps> = ({ card, display = true }) => {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useCardInteractions(cardRef);

  const handleClick = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) return;
    e.stopPropagation();
    // setExpanded((prev) => !prev);
  };

  const cardTypeLower = card.type.toLowerCase();

  return (
    <div
      ref={cardRef}
      id="card-gold"
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
        {/* Type de la carte */}
        <img
          src="/assets/template_cards/gold.webp"
          alt="gold.png"
          className="relative z-10 w-full h-auto user-drag-none"
        />

        {/* Nom de la carte */}
        <div className="absolute w-[170px] overflow-hidden flex items-center font-GillSans font-sem z-20 top-[12px] left-[68px] text-[23px] h-[30px] text-stroke line">
          <p className="card-name leading-none">{card.title}</p>
        </div>

        {/* PV */}
        <p className="absolute font-GillSans font-bold z-20 top-[12px] right-[45px] text-[8px] tracking-tighter text-black text-stroke">
          PV
          <span className="card-hp text-[23px] font-GillSans font-sem tracking-tighter">
            {card.pv.toString()}
          </span>
        </p>

        {/* Energie */}
        <div className="absolute top-[15px] right-[16.5px] z-30 w-[26px] h-[26px]">
          <div className="relative rounded-full bg-white flex justify-center items-center">
            <img
              src={`/assets/energies/${card.type.toLowerCase()}.png`}
              alt="energy.png"
            />
          </div>
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
        <div className="flex justify-center flex-col gap-3 items-center absolute z-20 bottom-[74px] left-[24px] h-[160px] w-[295px] p-1">
          {card.attacks.map((attack, index) => (
            <div key={index} className="flex flex-col w-full">
              <div className="flex justify-between w-full align-baseline">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex w-[80px] items-center gap-[2px]`}
                    data-energy={card.type.toLowerCase()}
                  >
                    {attack.cost > 0 &&
                      Array.from({ length: attack.cost }, (_, i) => (
                        <div
                          key={i}
                          className="relative w-[17.5px] h-[17.5px] rounded-full bg-white flex justify-center items-center"
                        >
                          <img
                            src={`/assets/energies/${card.type.toLowerCase()}.png`}
                            alt="energy.png"
                            className="atk-energy w-[17.5px] h-[17.5px] rounded-full"
                          />
                        </div>
                      ))}
                  </div>
                  <p className="font-GillSans w-[160px] overflow-x-hidden font-sem text-[18px] leading-[25px] text-stroke whitespace-nowrap">
                    {attack.name}
                  </p>
                </div>
                <p
                  className={`font-GillSans font-semibold text-[18px] leading-[25px] tracking-tighter text-stroke`}
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
          <p className="text-black">Faiblesse</p>
        </div>

        {/* Résistance */}
        <div className="absolute font-GillSans z-20 bottom-[54.5px] left-[107px] text-[7px] items-center overflow-hidden">
          <p className="text-black">Résistance</p>
        </div>

        {/* Retraite */}
        <div className="absolute font-GillSans flex z-20 bottom-[54.5px] left-[210px] text-[7px] items-center overflow-hidden gap-1">
          <p className="text-black">Retraite</p>
          <img
            src={`/assets/energies/${card.type.toLowerCase()}.png`}
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

        {/* Description de la carte */}
        <div className="flex absolute z-20 bottom-[16px] right-[18px] w-[160px] h-[32px] text-right items-center overflow-hidden">
          <p className="card-description w-full font-Mitra font-medium text-[11px] leading-[11px] text-black text-stroke-xs text-right">
            {card.description}
          </p>
        </div>

        {/* Crédits */}
        <div className="absolute z-10 bottom-[4px] left-0 w-full">
          <p className="w-full font-GillSans font-medium text-[6px] leading-[6px] text-black text-center">
            ©{new Date().getFullYear()} Pokemon / Nintendo / Creatures / GAME
            FREAK
          </p>
        </div>

        {/* Shine effects + glare */}
        <div className="effects absolute top-0 left-0 w-full h-full">
          <div className="shine gold z-20 absolute h-full w-full top-0 bg-transparent"></div>
          <div className="glare absolute w-full h-full z-30"></div>
        </div>
      </div>
    </div>
  );
};

export default GoldCard;
