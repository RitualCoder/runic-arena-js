import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Runic Arena",
  description: "Créez et partagez vos cartes pokemon avec vos amis !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <SessionProvider>
        <body className="min-w-[430px]">
          {/* Navbar */}
          <NavBar />
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
