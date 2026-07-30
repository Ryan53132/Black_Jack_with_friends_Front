import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() { // Componentes no React devem começar com letra MAIÚSCULA
  const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:3000';
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado reativo para erros

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Limpa mensagens anteriores

    // 1. Validação do front-end para senhas divergentes
    if (password !== confirmpassword) {
      setErrorMessage('As senhas não coincidem!');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setErrorMessage(data.error || 'Erro ao realizar cadastro.');
        } else {
          setErrorMessage(`Erro no servidor: Status ${response.status}`);
        }
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      setErrorMessage('Falha ao conectar ao servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-fuchsia-500 selection:text-zinc-950 flex flex-col justify-between relative overflow-hidden">
      
      {/* Luzes de fundo Neon (Glow suave) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

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

      {/* ================= FORMULÁRIO DE CADASTRO ================= */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl shadow-2xl relative">
          
          {/* Título do Form */}
          <div className="text-center mb-6">
            <h2 
              className="text-3xl font-black italic text-zinc-100 mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Crie sua Conta
            </h2>
            <p className="text-xs text-zinc-400">
              Junte-se ao <span className="text-fuchsia-400 font-semibold">Echo Palace</span> e aproveite a noite.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campo Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Username
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
                Password
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

            {/* Campo Confirm Password */}
            <div>
              <label htmlFor="confirmpassword" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmpassword"
                value={confirmpassword}
                onChange={(e) => setConfirmpassword(e.target.value)}
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
              Register
            </button>

            {/* Mensagem de Erro (Estilizada com Danger Rose-500) */}
            {errorMessage && (
              <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-center">
                <p className="text-xs font-semibold text-rose-400">{errorMessage}</p>
              </div>
            )}
          </form>

          {/* Links de navegação no rodapé do card */}
          <div className="mt-6 pt-6 border-t border-zinc-800/80 text-center space-y-2">
            <p className="text-xs text-zinc-400">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-cyan-400 hover:underline font-bold">
                Faça login aqui.
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