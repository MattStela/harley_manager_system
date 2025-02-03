"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase"; // Importe o Firestore corretamente
import { collection, getDocs } from "firebase/firestore";

export default function MembersList() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const membersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        membersList.sort((a, b) => a.nickname.localeCompare(b.nickname));
        setMembers(membersList);
      } catch (error) {
        console.error("Erro ao buscar a lista de membros:", error);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center bg-gray-900 rounded-3xl p-4">
      <h2 className="text-2xl text-white mb-4">Lista de Membros</h2>
      {members.length > 0 ? (
        <ul className="w-full">
          {members.map((member) => (
            <li key={member.id} className="bg-gray-800 text-white p-2 mb-2 rounded-lg">
              <p><strong className="text-gray-500">Nome:</strong> {member.nickname}</p>
              <p><strong className="text-gray-500">Email:</strong> {member.email}</p>
              <p><strong className="text-gray-500">Telefone:</strong> {member.phone}</p>
              <p><strong className="text-gray-500">Cargo:</strong> {member.role}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white">Nenhum membro encontrado.</p>
      )}
    </div>
  );
}
