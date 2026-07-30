import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Importando as páginas que estarão em outros arquivos
import Home from '../pages/home';
import Menu from '../pages/menu';
import Login from '../pages/login';
import Register from '../pages/register';
import { useEffect, useState } from "react";
import { fetchComAuth } from "../services/api";

// O "Segurança" das rotas privadas
export function PrivateRoute() {
  const [status, setStatus] = useState<"loading" | "authorized" | "unauthorized">("loading");

  useEffect(() => {
    async function validarAcesso() {
      try {
        // 🚨 Faz a requisição direto sem checar localStorage.
        // O fetchComAuth enviará o accessToken da memória (se existir).
        // Se a memória estiver vazia ou o token expirado, o fetchComAuth chamará 
        // a rota /api/refresh enviando o Cookie HttpOnly automaticamente!
        const response = await fetchComAuth("/api/perfil");

        if (response.ok) {
          setStatus("authorized");
        } else {
          setStatus("unauthorized");
        }
      } catch (error) {
        // Se até o cookie de refresh expirou ou falhou, manda para o login
        setStatus("unauthorized");
      }
    }

    validarAcesso();
  }, []);

  // ⏳ 1. Spinner enquanto a API valida a sessão
  if (status === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  // 🔴 2. Se não estiver autorizado, redireciona
  if (status === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  // 🟢 3. Se autorizado, libera o conteúdo
  return <Outlet />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Rotas Privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/menu" element={<Menu />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}