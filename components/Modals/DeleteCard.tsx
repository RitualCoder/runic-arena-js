import React from "react";
import Button from "../Buttons/Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  error?: string;
  loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message = "Êtes-vous sûr de vouloir supprimer cette carte ?",
  error,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl border-4 border-primary">
        <h2 className="text-xl font-bold text-gray-900 text-center">
          Confirmation
        </h2>
        <p className="text-gray-700 text-center mt-3">{message}</p>

        {error && <p className="text-red-500 text-center mt-3">{error}</p>}

        <div className="flex justify-center mt-6 gap-4">
          <Button onClick={onClose} variant="primary" size="small">
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            size="small"
            loading={loading}
            disabled={loading}
          >
            {loading ? "Suppression en cours ..." : "Supprimer"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
