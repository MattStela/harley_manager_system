import { useState } from "react";
import { auth, db } from "@/firebase"; // Importe o Firestore corretamente
import { doc, setDoc } from "firebase/firestore";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(formData.email, formData.password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        nickname: formData.nickname,
        email: formData.email
      });
      console.log("Usuário registrado com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar o usuário:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} placeholder="Nickname" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
      <button type="submit">Registrar</button>
    </form>
  );
}
