import { useEffect, useState } from "react"; // Importa hooks do React
import { doc, getDoc } from "firebase/firestore"; // Importa funções do Firestore
import { db } from "@/firebase"; // Importa a instância do Firestore configurada
import { useAuth } from "../../components/AuthContext"; // Importa o hook de autenticação

export default function HeaderTop() {
  const [userData, setUserData] = useState(null); // Estado para armazenar os dados do usuário
  const loggedInUser = useAuth(); // Obtém o usuário logado do contexto de autenticação

  useEffect(() => {
    if (loggedInUser && loggedInUser.uid) { // Verifica se há um usuário logado com UID
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", loggedInUser.uid)); // Busca o documento do usuário no Firestore
          if (userDoc.exists()) {
            console.log("User data fetched:", userDoc.data()); // Loga os dados do usuário
            setUserData(userDoc.data()); // Atualiza o estado com os dados do usuário
          } else {
            console.error("Nenhum documento encontrado!"); // Loga um erro se o documento não for encontrado
          }
        } catch (error) {
          console.error("Erro ao buscar os dados do usuário:", error); // Loga um erro se a busca falhar
        }
      };
      fetchUserData(); // Chama a função para buscar os dados do usuário
    } else {
      console.error("Usuário atual não está definido."); // Loga um erro se o usuário não estiver definido
    }
  }, [loggedInUser]); // Executa o efeito quando o usuário logado mudar

  return (
    <div className="header-top">
      <h1>{userData ? `Bem-vindo, ${userData.nickname}!` : "Carregando..."}</h1> {/* Exibe uma mensagem de boas-vindas ou "Carregando..." */}
      {loggedInUser ? ( // Verifica se há um usuário logado
        <div>
          <p>UID: {loggedInUser.uid}</p> {/* Exibe o UID do usuário */}
          {userData && ( // Verifica se os dados do usuário foram carregados
            <>
              <p>Celular: {userData.phone}</p> {/* Exibe o telefone do usuário */}
              <p>Cargo/função: {userData.role}</p> {/* Exibe o cargo/função do usuário */}
            </>
          )}
        </div>
      ) : (
        <p>Nenhum usuário logado</p> // Exibe uma mensagem se nenhum usuário estiver logado
      )}
    </div>
  );
}
