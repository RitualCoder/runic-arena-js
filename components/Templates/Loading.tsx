import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-73px)]">
      <img
        src="/assets/loaders/pikachu-loader.gif"
        alt="Chargement en cours ..."
        className="w-32"
      />
    </div>
  );
};

export default Loading;
