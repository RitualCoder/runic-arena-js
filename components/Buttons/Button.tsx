import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  startIcon?: React.ReactNode;
  iconClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "medium",
  variant = "primary",
  loading = false,
  startIcon,
  iconClassName = "",
  disabled,
  className = "",
  ...props
}) => {
  // Classe de base pour le bouton
  let baseClasses = "cta-button";

  // Gestion des tailles
  const sizeClasses = {
    small: "py-2 px-4 text-sm",
    medium: "py-3 px-6 text-base",
    large: "py-4 px-8 text-lg",
  };
  baseClasses += ` ${sizeClasses[size]}`;

  // Gestion des variantes
  if (variant === "secondary") {
    baseClasses += " cta-button--add";
  } else if (variant === "danger") {
    baseClasses += " cta-button--delete";
  }

  // Gestion du loading
  if (loading) {
    baseClasses += " cta-button--loading";
  }

  // Ajout de classes additionnelles éventuelles
  if (className) {
    baseClasses += ` ${className}`;
  }

  // Définition d'une taille par défaut pour l'icône en fonction de la taille du bouton
  const defaultIconSizes = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  };

  return (
    <button
      className={`${baseClasses} flex items-center justify-center`}
      disabled={loading || disabled}
      {...props}
    >
      {startIcon && (
        <span
          className={`${children && "mr-2"} inline-flex items-center ${defaultIconSizes[size]} ${iconClassName}`}
        >
          {startIcon}
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
