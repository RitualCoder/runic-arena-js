import { RefObject, useEffect, useRef } from "react";

export const useCardInteractions = (
  cardRef: RefObject<HTMLDivElement | null>
) => {
  const enterTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);

  useEffect(() => {
    const card = cardRef?.current;
    if (!card) return;

    const cardContent = card.querySelector(".card-content");
    const shine = card.querySelector(".shine");
    const effects = card.querySelector(".effects");
    if (!cardContent || !shine || !effects) return;

    const setDefaultValues = (el: Element) => {
      const styles = (el as HTMLElement).style;
      styles.setProperty("--mx", "50%");
      styles.setProperty("--my", "50%");
      styles.setProperty("--hyp", "0");
      styles.setProperty("--pos", "50% 50%");
      styles.setProperty("--posx", "50%");
      styles.setProperty("--posy", "50%");
      styles.setProperty("--op", "0");
    };

    const round = (value: number) => Math.round(value * 100) / 100;

    setDefaultValues(effects);

    const handleMouseEnter = () => {
      // Annuler le timer de leave si présent
      if (leaveTimer.current) {
        clearTimeout(leaveTimer.current);
        leaveTimer.current = null;
      }
      // Timer pour désactiver la transition
      enterTimer.current = window.setTimeout(() => {
        (cardContent as HTMLElement).style.setProperty(
          "transition-duration",
          "0s"
        );
        (shine as HTMLElement).style.setProperty("transition-duration", "0s");
      }, 300);
      (cardContent as HTMLElement).style.boxShadow =
        "0 15px 30px rgba(0, 0, 0, 0.6)";
      (effects as HTMLElement).style.setProperty("--op", "1");
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Rotation de la carte
      const xRot = (y / rect.height - 0.5) * 50;
      const yRot = (x / rect.width - 0.5) * -50;
      (
        cardContent as HTMLElement
      ).style.transform = `rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.05)`;

      // Effet brillant
      const mx = (x / rect.width) * 100;
      const my = (y / rect.height) * 100;
      (effects as HTMLElement).style.setProperty("--mx", `${mx}%`);
      (effects as HTMLElement).style.setProperty("--my", `${my}%`);

      const percent = {
        x: round((100 / rect.width) * x),
        y: round((100 / rect.height) * y),
      };
      const hyp = Math.sqrt((percent.y - 50) ** 2 + (percent.x - 50) ** 2) / 50;
      (effects as HTMLElement).style.setProperty("--hyp", hyp.toFixed(2));

      const percentSpring = {
        x: round((100 / rect.width) * x),
        y: round((100 / rect.height) * y),
      };
      const springBackground = {
        x: round(50 + percentSpring.x / 4 - 12.5),
        y: round(50 + percentSpring.y / 3 - 16.67),
      };
      (effects as HTMLElement).style.setProperty(
        "--pos",
        `${springBackground.x}% ${springBackground.y}%`
      );
      (effects as HTMLElement).style.setProperty(
        "--posx",
        `${springBackground.x}%`
      );
      (effects as HTMLElement).style.setProperty(
        "--posy",
        `${springBackground.y}%`
      );
    };

    const handleMouseLeave = () => {
      // Annuler le timer de enter si présent
      if (enterTimer.current) {
        clearTimeout(enterTimer.current);
        enterTimer.current = null;
      }
      (cardContent as HTMLElement).style.setProperty(
        "transition",
        "all 0.4s ease-out"
      );
      (shine as HTMLElement).style.setProperty(
        "transition",
        "all 0.4s ease-out"
      );
      leaveTimer.current = window.setTimeout(() => {
        (cardContent as HTMLElement).style.transform =
          "rotateX(0deg) rotateY(0deg) scale(1)";
        (cardContent as HTMLElement).style.boxShadow =
          "0 5px 15px rgba(0, 0, 0, 0.4)";
        setDefaultValues(effects);
        (effects as HTMLElement).style.setProperty("--op", "0");
      }, 400);
    };

    cardContent.addEventListener("mouseenter", handleMouseEnter);
    cardContent.addEventListener("mousemove", handleMouseMove as EventListener);
    cardContent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cardContent.removeEventListener("mouseenter", handleMouseEnter);
      cardContent.removeEventListener(
        "mousemove",
        handleMouseMove as EventListener
      );
      cardContent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cardRef]);
};
