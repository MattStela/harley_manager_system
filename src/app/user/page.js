"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import HeaderTop from "./HeaderTop";
import Register from "./register";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // Importar os ícones
import { auth, db } from "@/firebase"; // Importe o Firestore corretamente
import { doc, getDoc } from "firebase/firestore";

export default function User() {
  const [loggedInUser, setLoggedInUser] = useState(null); // Estado permanente do usuário logado
  const [userRole, setUserRole] = useState("");
  const [showRegister, setShowRegister] = useState(false); // Estado para controlar a exibição do componente Register

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

  return (
    <div className=" w-full p-4 flex justify-center items-center space-y-4 text-center flex-col">
      {/* === Cabeçalho ====================================================*/}
      <HeaderTop loggedInUser={loggedInUser} />
      <div className=" w-[300px] mt-4 mb-2 cursor-pointer" onClick={handleToggleRegister}>
        <span className="border p-4 text-gray-500 flex items-center justify-center">
          {showRegister ? (
            <FiChevronUp size={24} /> // Setinha para cima quando mostrar o registro
          ) : (
            <FiChevronDown size={24} /> // Setinha para baixo quando ocultar o registro
          )}
          Registrar Novo Membro
        </span>
        {showRegister && <Register loggedInUser={loggedInUser} />}
      </div>
      
    </div>
  );
}
