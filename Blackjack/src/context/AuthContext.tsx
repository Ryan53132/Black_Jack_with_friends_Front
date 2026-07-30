// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { fetchComAuth } from "../services/api";

interface User {
  id: number;
  username: string;
  gold: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const response = await fetchComAuth("/api/perfil");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // 👈 Salva o nome e ID do usuário no estado global
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    carregarUsuario();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o usuário em qualquer lugar do projeto
export const useAuth = () => useContext(AuthContext);