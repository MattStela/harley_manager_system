"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore"; // Certifique-se de importar getDoc
import { db } from "@/firebase"; // Certifique-se de importar corretamente
import { useAuth } from "../../components/AuthContext"; // Importe o hook de autenticação

export default function HeaderTop() {
  const [userData, setUserData] = useState(null);
  const loggedInUser = useAuth(); // Use o hook do contexto

  useEffect(() => {
    if (loggedInUser && loggedInUser.uid) {
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", loggedInUser.uid));
          if (userDoc.exists()) {
            console.log("User data fetched:", userDoc.data());
            setUserData(userDoc.data());
          } else {
            console.error("Nenhum documento encontrado!");
          }
        } catch (error) {
          console.error("Erro ao buscar os dados do usuário:", error);
        }
      };
      fetchUserData();
    } else {
      console.error("Usuário atual não está definido.");
    }
  }, [loggedInUser]);

  return (
    <div className="w-full flex justify-center items-center flex-col p-4">
      <h1 className="my-4">
        {userData ? `Bem-vindo, ${userData.nickname}!` : "Carregando..."}
      </h1>
      {loggedInUser ? (
        <div>
          <div className="flex flex-row items-center">
            <p className="text-gray-500">UID:</p>
            <p className="ml-2">{loggedInUser.uid}</p> {/* Exibindo o UID do usuário */}
          </div>
          {userData && (
            <>
              <div className="flex flex-row items-center">
                <p className="text-gray-500">Celular:</p>
                <p className="ml-2">{userData.phone}</p> {/* Exibindo o telefone do usuário */}
              </div>
              <div className="flex flex-row items-center">
                <p className="text-gray-500">Cargo/função:</p>
                <p className="ml-2">{userData.role}</p> {/* Exibindo o cargo/função do usuário */}
              </div>
            </>
          )}
        </div>
      ) : (
        <p>Nenhum usuário logado</p>
      )}
    </div>
  );
}
