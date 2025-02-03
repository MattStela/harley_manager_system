"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // Use next/navigation para cliente
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Header() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(true);
  const pathname = usePathname(); // Inicialize usePathname para verificar a rota atual
  const router = useRouter(); // Inicialize useRouter aqui

  useEffect(() => {
    if (pathname === "/") {
      setShowForm(true); // Mostra o formulário na página inicial
    } else {
      setShowForm(false); // Esconde o formulário em outras páginas
    }
  }, [pathname]);

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login bem-sucedido
        const user = userCredential.user;
        console.log("Usuário logado:", user);
        // Redirecione para a página "user" após o login
        router.push("/user");
      })
      .catch((error) => {
        // Erro ao fazer login, redirecione para a página de registro
        console.error("Erro ao fazer login:", error.code, error.message);
        router.push("/register"); // Redirecione para a página de registro
      });
  };

  const handleRegisterClick = () => {
    router.push("/register"); // Redirecione para a página de registro
  };

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

      {showForm && (
        <form onSubmit={handleLogin} className="p-1 flex flex-col items-center">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-xs text-black bg-white h-6 w-28 mb-2 p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-xs text-black bg-white h-6 w-28 mb-2 p-2 border rounded"
            required
          />
          <div className="flex flex-row items-center">
            <button
              type="submit"
              className="flex justify-center items-center p-2 h-5 text-xs text-white rounded hover:underline"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={handleRegisterClick}
              className="flex justify-center items-center p-2 h-5 text-xs text-white rounded hover:underline ml-2"
            >
              Registrar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
