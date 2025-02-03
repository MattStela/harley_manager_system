"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import HeaderTop from "./HeaderTop";
import Register from "./register";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // Importar os ícones
import { auth, db } from "@/firebase"; // Importe o Firestore corretamente
import { doc, getDoc } from "firebase/firestore";
import MembersList from "./MembersList";
import { useAuth } from "../../components/AuthContext"; // Importe o hook de autenticação

export default function User() {
  const [loggedInUser, setLoggedInUser] = useState(null); // Estado permanente do usuário logado
  const [userRole, setUserRole] = useState("");
  const [showRegister, setShowRegister] = useState(false); // Estado para controlar a exibição do componente Register
  const [showMembersList, setShowMembersList] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedInUser(user); // Definindo o estado permanente do usuário logado
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          console.error("Nenhum documento encontrado para o usuário atual!");
        }
      } else {
        setLoggedInUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleToggleRegister = () => {
    setShowRegister(!showRegister); // Alternar a exibição do componente Register
  };

  const handleToggleMembersList = () => {
    setShowMembersList(!showMembersList); // Alternar a exibição do componente MembersList
  };

  const loggedInUserFromContext = useAuth(); // Obtém o usuário logado do contexto de autenticação

  if (loggedInUserFromContext?.role === "integrante") {
    return (
      <div>
        <p>Bem-vindo, {loggedInUserFromContext.nickname}!</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 flex justify-center items-center space-y-4 text-center flex-col">
      {/* === Cabeçalho ====================================================*/}
      <div className="rounded-full w-full bg-gray-900 flex flex-col justify-center items-center">
        <HeaderTop loggedInUser={loggedInUser} />
      </div>
      {/* === Registro ====================================================*/}
      {userRole !== "integrante" && (
        <div className="w-full bg-gray-900 rounded-3xl">
          <div
            className=" w-full mt-4 mb-2 cursor-pointer"
            onClick={handleToggleRegister}
          >
            <span className="p-4 text-gray-500 flex items-center justify-center">
              {showRegister ? (
                <FiChevronUp size={24} /> // Setinha para cima quando mostrar o registro
              ) : (
                <FiChevronDown size={24} /> // Setinha para baixo quando ocultar o registro
              )}
              Registrar Novo Membro
            </span>
          </div>
          {showRegister && <Register loggedInUser={loggedInUser} />}
        </div>
      )}
      {/* === Lista de Membros ====================================================*/}
      {userRole !== "integrante" && (
        <div className="w-full bg-gray-900 rounded-3xl">
          <div
            className=" w-full mt-4 mb-2 cursor-pointer"
            onClick={handleToggleMembersList}
          >
            <span className="p-4 text-gray-500 flex items-center justify-center">
              {showMembersList ? (
                <FiChevronUp size={24} /> // Setinha para cima quando mostrar a lista de membros
              ) : (
                <FiChevronDown size={24} /> // Setinha para baixo quando ocultar a lista de membros
              )}
              Lista de Membros
            </span>
          </div>
          {showMembersList && <MembersList loggedInUser={loggedInUser} />}
        </div>
      )}
    </div>
  );
}
