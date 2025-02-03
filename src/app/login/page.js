"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensagens de erro
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage(""); // Resetar mensagem de erro

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login bem-sucedido
        const user = userCredential.user;
        console.log("Usuário logado:", user);
        // Redirecione para a página "user" após o login
        router.push("/user");
      })
      .catch((error) => {
        // Erro ao fazer login
        setErrorMessage("Erro ao fazer login: " + error.message);
        console.error("Erro ao fazer login:", error.code, error.message);
      });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black">
      <h1 className="text-2xl mb-4 text-white">Login</h1>
      <form
        onSubmit={handleLogin}
        className="bg-black p-6 rounded shadow-md w-80"
      >
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="password"
          >
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-black leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
        <button
          type="submit"
          className="bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
