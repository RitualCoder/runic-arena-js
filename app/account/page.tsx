"use client";

import { deleleUser } from "@/actions/account/delete";
import Button from "@/components/Buttons/Button";
import ConfirmationModal from "@/components/Modals/DeleteCard";
import { Trash, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const AccountPage: React.FC = () => {
  const { data: session, update } = useSession();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    const response = await deleleUser();
    if (response.success) {
      await signOut();
      update();
      return;
    }
    setError(response.error);
    setDeleteLoading(false);
  };

  return (
    <div className="h-dvh flex flex-col items-center justify-center z-10 relative overflow-hidden p-4 pt-0">
      {/* Fond jaune */}
      <div className="absolute -top-[30%] left-[50%] h-[155%] w-[90%] bg-primary rotate-12 z-0"></div>

      {/* Contenu principal */}
      <div className="flex flex-col justify-center items-start border-solid bg-white border-4 rounded-[20px] border-primary w-full max-w-[600px] p-8 relative z-10">
        <h1 className="text-xl font-bold md:text-3xl mb-4 self-center">
          Mon compte
        </h1>

        <div className="w-full flex flex-col gap-2 text-gray-700">
          <p>
            <span className="font-semibold">Nom :</span>{" "}
            {session?.user?.name || "Non renseigné"}
          </p>
          <p>
            <span className="font-semibold">Email :</span>{" "}
            {session?.user?.email}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full mt-6 md:mt-10">
          <div className="w-full flex justify-center">
            <Button
              startIcon={<LogOut />}
              size="small"
              onClick={() => signOut()}
            >
              Me déconnecter
            </Button>
          </div>

          <div className="w-full flex justify-center">
            <Button
              startIcon={<Trash />}
              variant="danger"
              size="small"
              onClick={openModal}
            >
              Supprimer mon compte
            </Button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={() => handleDelete()}
        error={error}
        loading={deleteLoading}
        message="Êtes-vous sûr de vouloir supprimer votre compte ? Cela supprimera toutes vos cartes et vos données."
      />
    </div>
  );
};

export default AccountPage;
