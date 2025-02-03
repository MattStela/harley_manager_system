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
    <header className="bg-gray-900 h-[120px] px-4 py-4 flex flex-row justify-between items-center shadow-md">
      <div className="flex items-center">
        <Image
          src="/harley-white.png"
          width={100}
          height={100}
          alt="ícone de harley branca"
          className="mr-4"
        />
        <Link href="/" className="text-white text-xl font-bold">
          Sistema Aro
        </Link>
      </div>
      <nav className="flex items-center space-x-4">
        <Link href="/" className="text-white hover:text-gray-300">
          Início
        </Link>
        {isLoggedIn && (
          <Link href="/user" className="text-white hover:text-gray-300">
            Painel
          </Link>
        )}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-300"
          >
            Sair
          </button>
        ) : (
          <Link href="/login" className="text-white hover:text-gray-300">
            Entrar
          </Link>
        )}
      </nav>
    </header>
  );
}
