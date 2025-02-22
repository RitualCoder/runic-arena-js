import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "medium",
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  ...props
}) => {
  // Classe de base avec le style général du bouton
  let baseClasses = "cta-button";

  // Gestion des tailles
  const sizeClasses = {
    small: "py-2 px-4",
    medium: "py-3 px-6",
    large: "py-4 px-8",
  };

  baseClasses += ` ${sizeClasses[size]}`;

  // Application de la variante selon la prop variant
  if (variant === "secondary") {
    baseClasses += " cta-button--add";
  } else if (variant === "danger") {
    baseClasses += " cta-button--delete";
  }

  // Si le bouton est en loading, on ajoute la classe correspondante
  if (loading) {
    baseClasses += " cta-button--loading";
  }

  // Ajout de classes additionnelles si fournies en props
  if (className) {
    baseClasses += ` ${className}`;
  }

  return (
    <button className={baseClasses} disabled={loading || disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
