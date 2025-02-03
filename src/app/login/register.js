"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase"; // Importe o Firestore corretamente
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Register({ loggedInUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    nickname: "",
    role: "",
    termsAccepted: false,
  });
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensagens de erro
  const [successMessage, setSuccessMessage] = useState(""); // Estado para mensagem de sucesso
  const [allowedRoles, setAllowedRoles] = useState([]); // Estado para cargos permitidos

  const getAllowedRoles = (currentRole) => {
    const roles = Array.from({ length: 8 }, (_, i) => `aro ${i + 1}`);
    if (currentRole === "adm") {
      return roles;
    }
    const currentRoleIndex = roles.indexOf(currentRole.toLowerCase());
    return roles.slice(currentRoleIndex + 1);
  };

  useEffect(() => {
    if (loggedInUser && loggedInUser.uid) {
      const fetchCurrentUserRole = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", loggedInUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setAllowedRoles(getAllowedRoles(userData.role));
          } else {
            console.error("Nenhum documento encontrado para o usuário atual!");
          }
        } catch (error) {
          console.error("Erro ao buscar os dados do usuário atual:", error);
        }
      };
      fetchCurrentUserRole();
    } else {
      console.error("Usuário atual não está definido.");
      setErrorMessage("Usuário atual não está definido. Por favor, faça login novamente.");
    }
  }, [loggedInUser]);

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

    if (!loggedInUser || !loggedInUser.uid) {
      setErrorMessage("Usuário atual não está definido. Por favor, faça login novamente.");
      return;
    }

    if (!formData.termsAccepted) {
      setErrorMessage("Você deve aceitar os termos e condições.");
      return;
    }

    if (!allowedRoles.includes(formData.role.toLowerCase())) {
      setErrorMessage("Você não tem permissão para registrar este cargo.");
      return;
    }

    const confirmRegistration = window.confirm("Você tem certeza que deseja registrar este usuário?");
    if (!confirmRegistration) {
      return;
    }

    try {
      // Verificar se o email já está em uso
      const signInMethods = await fetchSignInMethodsForEmail(auth, formData.email);
      if (signInMethods.length > 0) {
        setErrorMessage("O email já está em uso. Por favor, use outro email.");
        return;
      }

      // Registrar o novo usuário
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
      setErrorMessage(`Erro ao fazer o cadastro: ${error.message}`);
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
          <select
            id="role"
            value={formData.role}
            onChange={handleChange}
            className="shadow h-8 w-full appearance-none rounded-full py-2 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="" disabled>
              Selecione o Cargo
            </option>
            {allowedRoles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
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
          disabled={!formData.termsAccepted}
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
