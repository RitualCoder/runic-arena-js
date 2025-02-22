import { RefObject, useEffect, useRef } from "react";

export const useCardInteractions = (
  cardRef: RefObject<HTMLDivElement | null>
) => {
  const enterTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);
  const animationFrameId = useRef<number | null>(null);
  // Variable pour stocker le dernier événement (touch ou souris)
  let latestEvent: TouchEvent | MouseEvent | null = null;

  useEffect(() => {
    const card = cardRef?.current;
    if (!card) return;

    const cardContent = card.querySelector(".card-content");
    const shine = card.querySelector(".shine");
    const effects = card.querySelector(".effects");
    if (!cardContent || !shine || !effects) return;

    // Initialisation des variables CSS par défaut
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

    setDefaultValues(effects);

    const round = (value: number) => Math.round(value * 100) / 100;

    // Fonction d'animation, appelée via requestAnimationFrame
    const updateAnimation = () => {
      if (!latestEvent) return;
      const rect = card.getBoundingClientRect();
      let clientX: number, clientY: number;

      // Extraire les coordonnées selon le type d'événement
      if ("touches" in latestEvent && latestEvent.touches.length > 0) {
        clientX = latestEvent.touches[0].clientX;
        clientY = latestEvent.touches[0].clientY;
      } else if ("clientX" in latestEvent) {
        clientX = latestEvent.clientX;
        clientY = latestEvent.clientY;
      } else {
        return;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Calcul de la rotation et mise à jour de la transformation
      const xRot = (y / rect.height - 0.5) * 50;
      const yRot = (x / rect.width - 0.5) * -50;
      (cardContent as HTMLElement).style.transform = `rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.05)`;

      // Calcul et mise à jour des variables pour l'effet brillant
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
      (effects as HTMLElement).style.setProperty("--posx", `${springBackground.x}%`);
      (effects as HTMLElement).style.setProperty("--posy", `${springBackground.y}%`);

      // Demande la prochaine frame d'animation
      animationFrameId.current = window.requestAnimationFrame(updateAnimation);
    };

    // Gestionnaire commun pour le début de l'interaction (touchstart / mouseenter)
    const handleStart = (e: TouchEvent | MouseEvent) => {
      if (e.type === "touchstart") {
        // Empêcher le défilement par défaut sur mobile
        e.preventDefault();
      }
      // Annuler le timer de sortie s'il existe
      if (leaveTimer.current) {
        clearTimeout(leaveTimer.current);
        leaveTimer.current = null;
      }
      // Stocker l'événement pour l'animation
      latestEvent = e;
      enterTimer.current = window.setTimeout(() => {
        (cardContent as HTMLElement).style.setProperty("transition-duration", "0s");
        (shine as HTMLElement).style.setProperty("transition-duration", "0s");
      }, 300);
      (cardContent as HTMLElement).style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.6)";
      (effects as HTMLElement).style.setProperty("--op", "1");

      // Démarrer l'animation via requestAnimationFrame
      if (!animationFrameId.current) {
        animationFrameId.current = window.requestAnimationFrame(updateAnimation);
      }
    };

    // Gestionnaire commun pour le mouvement (touchmove / mousemove)
    const handleMove = (e: TouchEvent | MouseEvent) => {
      if (e.type === "touchmove") {
        e.preventDefault();
      }
      latestEvent = e;
      // La mise à jour se fait dans updateAnimation
    };

    // Gestionnaire commun pour la fin de l'interaction (touchend / mouseleave)
    const handleEnd = (e: TouchEvent | MouseEvent) => {
      if (enterTimer.current) {
        clearTimeout(enterTimer.current);
        enterTimer.current = null;
      }
      (cardContent as HTMLElement).style.setProperty("transition", "all 0.4s ease-out");
      (shine as HTMLElement).style.setProperty("transition", "all 0.4s ease-out");

      leaveTimer.current = window.setTimeout(() => {
        (cardContent as HTMLElement).style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        (cardContent as HTMLElement).style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.4)";
        setDefaultValues(effects);
        (effects as HTMLElement).style.setProperty("--op", "0");
      }, 400);

      // Arrêter l'animation
      if (animationFrameId.current) {
        window.cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };

    // Ajout des écouteurs d'événements tactiles (avec { passive: false } pour pouvoir appeler preventDefault)
    cardContent.addEventListener("touchstart", handleStart as EventListener, { passive: false });
    cardContent.addEventListener("touchmove", handleMove as EventListener, { passive: false });
    cardContent.addEventListener("touchend", handleEnd as EventListener);

    // Ajout des écouteurs d'événements souris (pour le desktop)
    cardContent.addEventListener("mouseenter", handleStart as EventListener);
    cardContent.addEventListener("mousemove", handleMove as EventListener);
    cardContent.addEventListener("mouseleave", handleEnd as EventListener);

    return () => {
      cardContent.removeEventListener("touchstart", handleStart as EventListener);
      cardContent.removeEventListener("touchmove", handleMove as EventListener);
      cardContent.removeEventListener("touchend", handleEnd as EventListener);
      cardContent.removeEventListener("mouseenter", handleStart as EventListener);
      cardContent.removeEventListener("mousemove", handleMove as EventListener);
      cardContent.removeEventListener("mouseleave", handleEnd as EventListener);
    };
  }, [cardRef]);
};
