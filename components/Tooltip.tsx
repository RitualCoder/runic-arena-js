import React from "react";

interface TooltipProps {
  content: React.ReactNode;
  placement?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = "top",
  children,
  className = "",
}) => {
  let positionClasses = "";

  switch (placement) {
    case "top":
      positionClasses = "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      break;
    case "bottom":
      positionClasses = "top-full left-1/2 transform -translate-x-1/2 mt-2";
      break;
    case "left":
      positionClasses = "right-full top-1/2 transform -translate-y-1/2 mr-2";
      break;
    case "right":
      positionClasses = "left-full top-1/2 transform -translate-y-1/2 ml-2";
      break;
    default:
      positionClasses = "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
  }

  return (
    <div className="relative inline-block group text-center">
      {children}
      <div
        role="tooltip"
        className={`tooltip absolute z-50 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-600 rounded-lg shadow-xs opacity-0 group-hover:visible group-hover:opacity-100 dark:bg-gray-700 ${positionClasses} ${className}`}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
