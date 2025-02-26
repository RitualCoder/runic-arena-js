import React, { useState, useRef } from "react";
import { Card } from "@/types/card";
import { useCardInteractions } from "@/hooks/useCardInteractions";

interface HolographicCardProps {
  card: Card;
  display?: boolean;
}

const HolographicCard: React.FC<HolographicCardProps> = ({
  card,
  display = true,
}) => {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useCardInteractions(cardRef);

  const handleClick = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) return;
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const cardTypeLower = card.type.toLowerCase();

  return (
    <div
      ref={cardRef}
      id="card-holo"
      onClick={handleClick}
      className={`card ${!display ? "hidden" : ""} ${
        expanded ? "expanded" : ""
      }`}
    >
      <div
        className={`card-content overflow-hidden ${
          cardTypeLower === "dark" ? "text-white" : "text-black"
        }`}
      >
        {/* Type de la carte */}
        <img
          src={`/assets/template_cards/basic/${cardTypeLower}.png`}
          alt={`${card.type} background`}
          className="card-type relative z-10 w-full h-auto user-drag-none"
        />

        {/* Nom de la carte */}
        <p className="absolute w-[155px] overflow-hidden font-GillSans font-sem z-20 top-[11px] left-[68px] text-[23px]">
          {card.title}
        </p>

        {/* PV */}
        <p className="absolute font-GillSans font-bold z-20 top-[7px] right-[46px] text-[8px] tracking-tighter">
          PV
          <span className="card-hp text-[28px] font-GillSans font-sem tracking-tighter">
            {card.pv.toString()}
          </span>
        </p>

        {/* Image du Pokémon */}
        <div className="absolute top-[43px] left-[25px] h-[183px] w-[290px] bg-black user-drag-none z-0">
          <img
            draggable="false"
            src={
              card.imageUrl ? card.imageUrl : "/assets/backgrounds/runicBg.jpg"
            }
            alt="Image carte"
            className="card-img h-full w-full object-cover"
          />
        </div>

        {/* Attaques */}
        <div className="attack-content-holo flex justify-center flex-col gap-3 items-center absolute z-20 bottom-[74px] left-[24px] h-[160px] w-[295px] p-1">
          {card.attacks.map((attack, index) => (
            <div key={index} className="flex flex-col w-full">
              <div className="flex justify-between w-full align-baseline">
                <div className="flex items-center gap-6">
                  <div
                    className={`energies-${
                      index + 1
                    } flex w-[60px] items-center gap-[2px]`}
                  >
                    {attack.cost > 0 &&
                      Array.from({ length: attack.cost }, (_, i) => (
                        <img
                          key={i}
                          src={`/assets/energies/${cardTypeLower}.png`}
                          alt="energy.png"
                          className="atk-energy w-[17.5px] h-[17.5px] rounded-full"
                        />
                      ))}
                  </div>
                  <p className="font-GillSans w-[160px] overflow-x-hidden font-sem text-[18px] leading-[25px] whitespace-nowrap">
                    {attack.name}
                  </p>
                </div>
                <p
                  className={`font-GillSans font-semibold text-[18px] leading-[25px] tracking-tighter`}
                >
                  {attack.damage}
                </p>
              </div>
              <p
                className={`font-GillSans font-medium text-[10px] mt-1 break-words leading-none`}
              >
                {attack.description}
              </p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="flex absolute z-20 bottom-[13px] right-[18px] w-[160px] h-[32px] text-right items-center overflow-hidden">
          <p className="card-description w-full font-Mitra font-medium text-[11px] leading-[11px] text-gray-700 text-right">
            {card.description}
          </p>
        </div>

        {/* Faiblesse */}
        <div className="absolute font-GillSans z-20 bottom-[53.5px] left-[20px] w-[160px] text-[7px] items-center">
          <p className="text-black">Faiblesse</p>
        </div>

        {/* Résistance */}
        <div className="absolute font-GillSans z-20 bottom-[53.5px] left-[107px] text-[7px] items-center overflow-hidden">
          <p className="text-black">Résistance</p>
        </div>

        {/* Retraite */}
        <div className="absolute font-GillSans flex z-20 bottom-[52.5px] left-[215px] text-[7px] items-center overflow-hidden gap-1">
          <p className="text-black">Retraite</p>
          <img
            src={`/assets/energies/${cardTypeLower}.png`}
            alt="energy.png"
            className="w-[12px] h-[12px] rounded-full"
          />
        </div>

        {/* Illustration */}
        <div className="absolute flex flex-col z-20 bottom-[15px] left-[20px] text-black gap-[1px]">
          <p className="w-full font-GillSans font-medium text-[6px] leading-[6px]">
            Illus. Runic Arena
          </p>
          <p className="text-[7px] flex items-center">
            001/151 <span className="text-[8px] text-black ml-[2px]">●</span>
          </p>
        </div>

        {/* Crédits */}
        <div className="absolute z-10 bottom-[4px] left-0 w-full">
          <p className="w-full font-GillSans font-medium text-[6px] leading-[6px] text-black text-center">
            ©{new Date().getFullYear()} Pokemon / Nintendo / Creatures / GAME
            FREAK
          </p>
        </div>

        {/* Effets holographiques */}
        <div className="effects absolute top-0 left-0 w-full h-full">
          <div className="shine basic-holo z-20 absolute h-full w-full top-0 bg-transparent"></div>
          <div className="glare absolute w-full h-full z-30"></div>
        </div>
      </div>
    </div>
  );
};

export default HolographicCard;
