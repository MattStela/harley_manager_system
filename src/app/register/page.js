"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase"; // Importe o Firestore corretamente
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensagens de erro
  const [successMessage, setSuccessMessage] = useState(""); // Estado para mensagem de sucesso
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Iniciando o registro");
    setErrorMessage(""); // Resetar mensagem de erro
    setSuccessMessage(""); // Resetar mensagem de sucesso

    if (!termsAccepted) {
      setErrorMessage("Você deve aceitar os termos e condições.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuário cadastrado com sucesso:", user);

      // Salve informações adicionais no Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        termsAccepted
      });
      console.log("Informações adicionais salvas no Firestore");

      // Exiba a mensagem de sucesso
      setSuccessMessage("Registrado com sucesso!");

      // Redirecione para a página de login após um breve atraso
      setTimeout(() => {
        console.log("Redirecionando para a página de login");
        router.push("/login");
      }, 2000); // 2 segundos de atraso para exibir a mensagem de sucesso
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("O email já está em uso. Por favor, use outro email.");
      } else {
        setErrorMessage(`Erro ao fazer o cadastro: ${error.message}`);
      }
      console.error("Erro ao fazer o cadastro:", error.code, error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black">
      <h1 className="text-2xl mb-4 text-white">
        Cadastro de Membro do Motoclube
      </h1>
      <form
        onSubmit={handleRegister}
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
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="bg-white text-black mr-2 leading-tight"
              required
            />
            Aceito os termos e condições
          </label>
        </div>
        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
        <button
          type="submit"
          className="bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={!termsAccepted}
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
