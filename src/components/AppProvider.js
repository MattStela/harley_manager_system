// components/AppProvider.js
import { AuthProvider } from "./AuthContext";

export default function AppProvider({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
