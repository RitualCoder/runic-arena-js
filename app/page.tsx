"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import BasicCard from "@/components/Cards/CommonCard";
import GoldCard from "@/components/Cards/GoldCard";
import HolographicCard from "@/components/Cards/HolographicCard";
import VCard from "@/components/Cards/VCard";
import { showcaseCard } from "@/lib/utils";
import Button from "@/components/Buttons/Button";
import React, { useState, useEffect } from "react";

// Hook personnalisé pour la media query
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

const Home: React.FC = () => {
  const { data: session } = useSession();
  // On considère mobile si la largeur est inférieure ou égale à 767px
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className="relative h-min-dvh overflow-hidden">
      {/* Fond jaune */}
      <div className="absolute -top-[30%] md:left-[50%] h-[500vh] w-full bg-primary rotate-12 z-[-1]"></div>

      {isMobile ? (
        // Version MOBILE uniquement rendue sur mobile
        <section className="h-screen flex flex-col page-section items-center relative pt-[73px]">
          <div className="w-full h-full flex flex-col justify-start items-center relative z-10">
            <div className="flex flex-col gap-6 px-8 justify-center items-center">
              <div className="flex flex-col gap-2 items-center">
                <h1 className="text-2xl font-Kanit font-medium">
                  Prêt à tous les créer !
                </h1>
                <h3 className="text-md font-Kanit text-center">
                  Créez vos propres cartes Pokémon et donnez vie à vos idées ✨
                </h3>
              </div>
              <Link
                href={session ? "/cards/create" : "/login"}
                className="w-fit"
              >
                <Button variant="primary" size="small">
                  Créer <span className="text-primary ml-1">ma carte</span>
                </Button>
              </Link>
            </div>
            {showcaseCard && (
              <div className="flex justify-center items-center scale-[0.8]">
                <div className="card-container p-1 w-[350px]">
                  {showcaseCard.rarity === "COMMON" && (
                    <BasicCard card={showcaseCard} />
                  )}
                  {showcaseCard.rarity === "HOLOGRAPHIC" && (
                    <HolographicCard card={showcaseCard} />
                  )}
                  {showcaseCard.rarity === "GOLD" && (
                    <GoldCard card={showcaseCard} />
                  )}
                  {showcaseCard.rarity === "V" && <VCard card={showcaseCard} />}
                </div>
              </div>
            )}
          </div>
          <img
            src="/assets/forms/yellowRound.png"
            alt="yellowRound"
            className="absolute top-[50%] left-[0%] h-[150px] -rotate-6 z-0"
          />
          <img
            src="/assets/forms/whiteDots.png"
            alt="points blanc"
            className="absolute bottom-[5%] left-[60%] sm:left-[50%] h-[120px] sm:h-[150px] z-0"
          />
        </section>
      ) : (
        // Version DESKTOP uniquement rendue sur grand écran
        <section className="page-section h-dvh md:flex flex-col items-center relative pt-[63px] md:pt-[73px]">
          <div className="w-full h-full flex flex-col md:flex-row justify-center px-10 sm:px-12 md:px-20 pb-10 z-10">
            <div className="w-full h-full md:w-2/3 flex flex-col justify-start items-center relative">
              <div className="flex flex-col gap-6 w-full h-full justify-between">
                <div />
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2 w-full">
                    <h1 className="text-3xl sm:text-4xl font-Kanit font-medium">
                      Prêt à tous les créer !
                    </h1>
                    <h3 className="text-lg sm:text-xl font-Kanit">
                      Créez vos propres cartes Pokémon et donnez vie à vos idées
                      ✨
                    </h3>
                  </div>
                  <Link
                    href={session ? "/cards/create" : "/login"}
                    className="w-fit"
                  >
                    <Button size="large" variant="primary">
                      Créer <span className="text-primary ml-1">ma carte</span>
                    </Button>
                  </Link>
                </div>
                {/* Boutons réseaux */}
                <div className="flex justify-start space-x-2 mt-6">
                  <Link href="https://github.com/RitualCoder">
                    <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex justify-center items-center">
                      <img
                        src="/assets/icons/socials/github.svg"
                        alt="github"
                        className="w-6 h-6 sm:w-8 sm:h-8"
                      />
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {showcaseCard && (
              <div className="hidden md:flex flex-1 justify-center items-center h-full">
                <div className="card-container p-1 w-[350px] h-auto">
                  {showcaseCard.rarity === "COMMON" && (
                    <BasicCard card={showcaseCard} />
                  )}
                  {showcaseCard.rarity === "HOLOGRAPHIC" && (
                    <HolographicCard card={showcaseCard} />
                  )}
                  {showcaseCard.rarity === "GOLD" && (
                    <GoldCard card={showcaseCard} />
                  )}
                  {showcaseCard.rarity === "V" && <VCard card={showcaseCard} />}
                </div>
              </div>
            )}
          </div>
          <img
            src="/assets/forms/yellowRound.png"
            alt="yellowRound"
            className="absolute -top-10 left-[40%] h-[150px] sm:h-[200px] -rotate-6 z-0"
          />
          <img
            src="/assets/forms/whiteDots.png"
            alt="points blanc"
            className="absolute bottom-[5%] left-[60%] sm:left-[50%] h-[120px] sm:h-[150px] z-0"
          />
        </section>
      )}
    </div>
  );
};

export default Home;
