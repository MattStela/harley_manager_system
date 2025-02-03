"use client";
import { useEffect, useState } from "react";

export default function HeaderTop() {
  const [userData, setUserData] = useState(null);
  const [userUID, setUserUID] = useState(null);

  useEffect(() => {
    const uid = localStorage.getItem("userUID");
    const data = localStorage.getItem("userData");
    if (uid && data) {
      setUserUID(uid);
      setUserData(JSON.parse(data));
    }
  }, []);

  return (
    <div className="border p-4">
      <h1 className="my-4">
        {userData ? `Bem-vindo, ${userData.nickname}!` : "Carregando..."}
      </h1>
      {userUID ? (
        <div>
          <div className="flex flex-row items-center">
            <p className="text-gray-500">UID:</p>
            <p className="ml-2">{userUID}</p> {/* Exibindo o UID do usuário */}
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
