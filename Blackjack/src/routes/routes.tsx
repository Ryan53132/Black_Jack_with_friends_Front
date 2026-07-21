import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Importando as páginas que estarão em outros arquivos
import Home from '../pages/home';
import Login from '../pages/login';
import Dashboard from '../pages/dashboard';

// O "Segurança" das rotas privadas
function PrivateRoute() {
  // Aqui você checaria o estado real do usuário (ex: Context API ou Redux)
  // Vamos forçar como true só para o exemplo
  const isLogged = true; 
  
  return isLogged ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas Privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}