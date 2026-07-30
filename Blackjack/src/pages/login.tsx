import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchComAuth, setAccessToken } from "../services/api";


export default function Login() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:3000";
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado reativo para erros

  useEffect(() => {
    let isMounted = true; // Controla se o componente continua montado

    async function verificarSessaoExistente() {
      try {
        const response = await fetchComAuth("/api/perfil");

        // 🚨 Só navega se o componente AINDA estiver montado e o backend der OK
        if (response.ok && isMounted) {
          navigate("/menu", { replace: true });
        } else if (isMounted) {
          setCheckingAuth(false);
        }
      } catch (error) {
        if (isMounted) {
          setCheckingAuth(false);
        }
      }
    }

    verificarSessaoExistente();

    // Limpeza para evitar vazamento de memória ou atualizações de estado pós-desmontagem
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Limpa erros anteriores

    try {
      const response = await fetch(`${BACKEND_URL}/api/register` ? `${BACKEND_URL}/api/login` : `${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        navigate("/menu", { state: { username } });
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setErrorMessage(data.error || "Credenciais inválidas.");
        } else {
          const textError = await response.text();
          setErrorMessage(textError || "Erro ao realizar login.");
        }
      }
    } catch (err) {
      setErrorMessage("Falha ao conectar com o servidor.");
    }
  };

  // ⏳ Se estiver verificando sessão silenciosa, exibe o carregando
  if (checkingAuth) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-fuchsia-500 selection:text-zinc-950 flex flex-col justify-between relative overflow-hidden">
      
      {/* Glows de luz neon de fundo */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= NAVBAR SIMPLIFICADA ================= */}
      <header className="px-6 lg:px-12 py-6 flex justify-between items-center relative z-10">
        <Link to="/" className="group">
          <span 
            className="text-2xl font-black italic tracking-wider text-fuchsia-500 drop-shadow-[0_0_12px_rgba(217,70,239,0.6)] group-hover:drop-shadow-[0_0_18px_rgba(217,70,239,0.9)] transition-all"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Echo <span className="text-cyan-400">Palace</span>
          </span>
        </Link>

        <Link 
          to="/" 
          className="text-xs font-semibold text-zinc-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
        >
          ← Voltar para a página inicial
        </Link>
      </header>

      {/* ================= CONTEÚDO PRINCIPAL (CONDICIONAL) ================= */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
          <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-12 rounded-2xl shadow-2xl text-center flex flex-col items-center justify-center">
            
            {/* Spinner Animado com Glow Neon */}
            <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
              {/* Anel Externo Giratório Rosa */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-fuchsia-500 border-r-fuchsia-500 animate-spin shadow-[0_0_15px_rgba(217,70,239,0.5)]"></div>
              
              {/* Anel Interno Giratório Inverso Azul */}
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-cyan-400 border-l-cyan-400 animate-spin [animation-direction:reverse] [animation-duration:1s]"></div>
              
              {/* Ponto Dourado Central */}
              <div className="w-3 h-3 bg-amber-300 rounded-full shadow-[0_0_10px_rgba(252,211,77,0.8)]"></div>
            </div>

            {/* Texto de Carregamento Estilizado */}
            <h3 
              className="text-xl font-bold italic text-zinc-100 mb-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Autenticando...
            </h3>
            <p className="text-xs text-zinc-400 animate-pulse">
              Acessando o salão principal do <span className="text-fuchsia-400 font-semibold">Echo Palace</span>
            </p>
          </div>
      </main>

      {/* Rodapé Simples */}
      <footer className="py-4 text-center text-xs text-zinc-600 relative z-10">
        © 2026 Echo Palace Casino. +18
      </footer>

    </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-fuchsia-500 selection:text-zinc-950 flex flex-col justify-between relative overflow-hidden">
      
      {/* Luzes de fundo Neon (Glow suave) */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= NAVBAR SIMPLIFICADA ================= */}
      <header className="px-6 lg:px-12 py-6 flex justify-between items-center relative z-10">
        <Link to="/" className="group">
          <span 
            className="text-2xl font-black italic tracking-wider text-fuchsia-500 drop-shadow-[0_0_12px_rgba(217,70,239,0.6)] group-hover:drop-shadow-[0_0_18px_rgba(217,70,239,0.9)] transition-all"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Echo <span className="text-cyan-400">Palace</span>
          </span>
        </Link>

        <Link 
          to="/" 
          className="text-xs font-semibold text-zinc-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
        >
          ← Voltar para a página inicial
        </Link>
      </header>

      {/* ================= FORMULÁRIO DE LOGIN ================= */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl shadow-2xl relative">
          
          {/* Título do Form */}
          <div className="text-center mb-6">
            <h2 
              className="text-3xl font-black italic text-zinc-100 mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Login
            </h2>
            <p className="text-xs text-zinc-400">
              Entre para continuar sua noite no <span className="text-fuchsia-400 font-semibold">Echo Palace</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campo Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Seu nome de usuário"
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            {/* Campo Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            {/* Botão Submit */}
            <button 
              type="submit"
              className="w-full mt-2 py-3.5 px-4 bg-fuchsia-500 hover:bg-fuchsia-400 text-zinc-950 font-black rounded-xl text-sm shadow-[0_0_20px_rgba(217,70,239,0.5)] hover:shadow-[0_0_30px_rgba(217,70,239,0.8)] transition-all transform active:scale-95"
            >
              Login
            </button>

            {/* Mensagem de Erro reativa */}
            {errorMessage && (
              <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-center">
                <p className="text-xs font-semibold text-rose-400">{errorMessage}</p>
              </div>
            )}
          </form>

          {/* Links de navegação no rodapé do card */}
          <div className="mt-6 pt-6 border-t border-zinc-800/80 text-center space-y-2">
            <p className="text-xs text-zinc-400">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-cyan-400 hover:underline font-bold">
                Registre-se aqui.
              </Link>
            </p>
          </div>

        </div>
      </main>

      {/* Rodapé Simples */}
      <footer className="py-4 text-center text-xs text-zinc-600 relative z-10">
        © 2026 Echo Palace Casino. +18
      </footer>

    </div>
  );
}