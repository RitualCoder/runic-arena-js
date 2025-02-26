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
  const isIconOnly = !children;

  let baseClasses = "cta-button";

  const sizeClasses = {
    small: "py-2 px-4 text-sm",
    medium: "py-3 px-6 text-base",
    large: "py-4 px-8 text-xl",
  };

  const iconOnlyClasses = {
    small: "p-2",
    medium: "p-3",
    large: "p-4",
  };

  baseClasses += ` ${isIconOnly ? iconOnlyClasses[size] : sizeClasses[size]}`;

  if (variant === "secondary") {
    baseClasses += " cta-button--add";
  } else if (variant === "danger") {
    baseClasses += " cta-button--delete";
  }

  if (loading) {
    baseClasses += " cta-button--loading";
  }

  if (className) {
    baseClasses += ` ${className}`;
  }

  const defaultIconSizes = {
    small: "w-5 h-5",
    medium: "w-6 h-6",
    large: "w-7 h-7",
  };

  return (
    <button
      className={`${baseClasses} flex items-center justify-center`}
      disabled={loading || disabled}
      {...props}
    >
      {startIcon && (
        <span
          className={`${children ? "mr-2" : ""} inline-flex items-center ${
            defaultIconSizes[size]
          } ${iconClassName}`}
        >
          {startIcon}
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
