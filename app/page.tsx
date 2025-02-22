"use client";

import NavBar from "@/components/NavBar";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <p>Bonjour</p>
    </div>
  );
}
