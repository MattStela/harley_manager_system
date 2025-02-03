"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase"; // Importe o Firestore corretamente
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    nickname: "",
    role: "",
    termsAccepted: true,
  });
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensagens de erro
  const [successMessage, setSuccessMessage] = useState(""); // Estado para mensagem de sucesso

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Iniciando o registro");
    setErrorMessage(""); // Resetar mensagem de erro
    setSuccessMessage(""); // Resetar mensagem de sucesso

    if (!formData.termsAccepted) {
      setErrorMessage("Você deve aceitar os termos e condições.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log("Usuário cadastrado com sucesso:", user);

      // Salve informações adicionais no Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: formData.email,
        phone: formData.phone,
        nickname: formData.nickname,
        role: formData.role,
        termsAccepted: formData.termsAccepted,
        isAdm: formData.role.toLowerCase() === "aro 1",
      });
      console.log("Informações adicionais salvas no Firestore");

      // Exiba a mensagem de sucesso
      setSuccessMessage("O cadastro foi realizado com sucesso!");

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-black p-4">
      <h1 className="text-2xl mb-6 text-white">Cadastro de Membro do Motoclube</h1>
      <form onSubmit={handleRegister} className="p-6 rounded-lg shadow-lg w-[300px] space-y-4">
        {[
          { id: "email", type: "email", label: "Email" },
          { id: "password", type: "password", label: "Senha" },
          { id: "phone", type: "tel", label: "Telefone" },
          { id: "nickname", type: "text", label: "Apelido" },
        ].map(({ id, type, label }) => (
          <div key={id} className="flex items-start flex-col">
            <label className="block text-white text-sm mb-2" htmlFor={id}>
              {label}
            </label>
            <input
              type={type}
              id={id}
              value={formData[id]}
              onChange={handleChange}
              className="shadow h-8 w-full appearance-none rounded-full py-2 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        ))}
        <div className="mb-4">
          <label className="block text-white text-sm mb-2" htmlFor="role">
            Função/Cargo
          </label>
          <input
            type="text"
            id="role"
            value={formData.role}
            onChange={handleChange}
            className="shadow h-8 w-full appearance-none rounded-full py-2 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
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
          className="bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
