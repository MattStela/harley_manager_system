"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Use next/navigation para cliente

export default function Header() {
  const [showForm, setShowForm] = useState(true);
  const pathname = usePathname(); // Inicialize usePathname para verificar a rota atual



  return (
    <div className="border h-[120px] px-4 py-4 flex flex-row justify-center items-center">
      <div className="h-full flex justify-center items-center">
        <Image
          src="/harley-white.png"
          width={100}
          height={100}
          alt="ícone de harley branca"
          className=""
        />
      </div>
      <div className="flex-grow h-full flex items-center justify-center p-4">
        <Link href="/">Início</Link>
      </div>
      <div className="flex-grow h-full flex items-center justify-center p-4">
        <Link href="/login">Entrar</Link>
      </div>
    </div>
  );
}
