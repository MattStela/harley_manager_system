"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para autenticar o usuário
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="px-4 py-4 flex flex-row justify-between items-center border">
      <div className="border h-full flex justify-center items-center">
        <Image
          src="/harley-white.png"
          width={100}
          height={100}
          alt="ícone de harley branca"
          className="border"
        />
      </div>
      <div className="border h-full flex items-center justify-center p-4">
        <Link href="/#">Início</Link>
      </div>

      <form
        onSubmit={handleLogin}
        className="p-1 border flex flex-col items-center"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-xs h-6 mb-2 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-xs h-6 mb-2 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="flex justify-center items-center p-2 h-6 bg-blue-500 text-xs text-white rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
