"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Button from "./Buttons/Button";

const DesktopNavbar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="hidden min-w-[430px] md:flex absolute top-0 left-0 w-full items-center justify-between px-8 py-4 z-50">
      {/* Logo */}
      <Link href="/">
        <img
          src="/assets/logos/RunicLogo.png"
          alt="Runic Arena Logo"
          className="w-[150px]"
        />
      </Link>

      {/* Actions utilisateur */}
      <div className="flex gap-4">
        {session?.user ? (
          <>
            {pathname !== "/cards" && (
              <Link href="/cards">
                <Button variant="primary" size="small">
                  Mes cartes
                </Button>
              </Link>
            )}

            <Link href="/account">
              <Button size="small">Mon compte</Button>
            </Link>
          </>
        ) : (
          <Link href="/auth/login">
            <Button size="small">Se connecter</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

const MobileNavbar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`md:hidden absolute top-0 left-0 w-full z-30 ${
        isOpen ? "bg-white" : ""
      }`}
    >
      {/* Navbar en haut avec menu burger */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/">
          <img
            src="/assets/logos/RunicLogo.png"
            alt="Runic Arena Logo"
            className="w-[120px]"
          />
        </Link>

        {/* Bouton Menu Burger */}
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu mobile qui slide in */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white/90 backdrop-blur-sm shadow-lg flex flex-col items-center gap-4 py-6 animate-slideIn">
          {session?.user ? (
            <>
              <Link href="/cards" onClick={() => setIsOpen(false)}>
                <Button variant="primary" size="small">
                  Mes cartes
                </Button>
              </Link>

              <Link href={"/account"} onClick={() => setIsOpen(false)}>
                <Button size="small">Mon Compte</Button>
              </Link>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button size="small">Se connecter</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

const Navbar: React.FC = () => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
};

export default Navbar;
