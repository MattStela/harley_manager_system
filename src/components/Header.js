"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Use next/navigation para cliente
import { useAuth } from "./AuthContext"; // Corrija o caminho do import
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname(); // Inicialize usePathname para verificar a rota atual
  const loggedInUser = useAuth(); // Obtém o usuário logado do contexto de autenticação

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userUID");
      localStorage.removeItem("userData");
      setIsLoggedIn(false);
      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    // Verifique se o usuário está logado ao carregar o componente
    const uid = localStorage.getItem("userUID");
    if (uid) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      setIsLoggedIn(true);
    }
  }, [loggedInUser]);

  return (
    <div className="bg-gray-900 h-[120px] px-4 py-4 flex flex-row justify-center items-center">
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
        {isLoggedIn ? (
          <button onClick={handleLogout} className="text-white">
            Sair
          </button>
        ) : (
          <Link href="/login">Entrar</Link>
        )}
      </div>
    </div>
  );
}
