import { useEffect, useState } from 'react';
import { fetchComAuth, logout } from "../services/api";
import { type UserProfile } from '../services/interfaces';
import { useNavigate } from 'react-router-dom';

function Menu() {
  const [CodigoSala, setCodigoSala] = useState('');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleLogout = async () => {
    logout(); // Limpa o token da memória
  };

  const handleEntrarSala = () => {
    if (!CodigoSala.trim()) return;
    navigate(`/jogo/${CodigoSala}`, { state: { codigoSala: CodigoSala } });
  };

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const response = await fetchComAuth("/api/perfil");
        if (response.ok) {
          const data = await response.json();
          // 💡 data.user contém { id, username, gold }
          setUser(data.user);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, []);

  // ================= TELA DE CARREGAMENTO DO PERFIL =================
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-12 rounded-2xl shadow-2xl text-center flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-fuchsia-500 border-r-fuchsia-500 animate-spin shadow-[0_0_15px_rgba(217,70,239,0.5)]"></div>
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-cyan-400 border-l-cyan-400 animate-spin [animation-direction:reverse] [animation-duration:1s]"></div>
            <div className="w-3 h-3 bg-amber-300 rounded-full shadow-[0_0_10px_rgba(252,211,77,0.8)]"></div>
          </div>
          <h3 
            className="text-xl font-bold italic text-zinc-100 mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Carregando perfil...
          </h3>
          <p className="text-xs text-zinc-400 animate-pulse">
            Preparando a mesa no <span className="text-fuchsia-400 font-semibold">Echo Palace</span>
          </p>
        </div>
      </div>
    );
  }

  // Obter a inicial do usuário para o Avatar
  const initialLetter = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-fuchsia-500 selection:text-zinc-950 flex flex-col justify-between relative overflow-hidden">
      
      {/* Glows neon de fundo */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= NAVBAR COM PERFIL E SALDO ================= */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-6 lg:px-12 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <span 
            className="text-2xl font-black italic tracking-wider text-fuchsia-500 drop-shadow-[0_0_12px_rgba(217,70,239,0.6)]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Echo <span className="text-cyan-400">Palace</span>
          </span>
        </div>

        {/* PAINEL DO USUÁRIO & SALDO */}
        <div className="flex items-center gap-4">
          
          {/* Card de Ouro / Saldo */}
          <div className="bg-zinc-900 border border-amber-300/30 px-3.5 py-1.5 rounded-xl flex items-center gap-2.5 shadow-[0_0_10px_rgba(252,211,77,0.1)]">
            <span className="text-lg">🪙</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider leading-none">Ouro</span>
              <span className="text-sm font-black text-amber-300">{user?.gold ?? 0}</span>
            </div>
          </div>

          {/* PERFIL / AVATAR */}
          <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800 p-1.5 pr-4 rounded-full">
            {/* Círculo do Avatar com a Inicial */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-600 to-cyan-400 flex items-center justify-center text-zinc-950 font-black text-sm shadow-[0_0_10px_rgba(217,70,239,0.5)]">
              {initialLetter}
            </div>
            
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] text-zinc-400 leading-none">Bem-vindo,</span>
              <span className="text-xs font-bold text-zinc-100 leading-tight">{user?.username}</span>
            </div>
          </div>

          {/* Botão Logout */}
          <button 
            onClick={handleLogout}
            className="px-3.5 py-2 bg-zinc-900 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-500/30 rounded-xl text-xs font-bold transition-all"
          >
            Sair
          </button>
        </div>
      </header>

      {/* ================= CONTEÚDO PRINCIPAL (ENTRAR NA SALA) ================= */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10 max-w-xl mx-auto w-full">
        
        <div className="w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-2xl relative text-center">
          
          <div className="max-w-md mx-auto mb-8">
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
              Lobby de Jogos
            </div>
            <h1 
              className="text-3xl font-black italic text-zinc-100 mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Acessar Mesa
            </h1>
            <p className="text-xs text-zinc-400">
              Insira o código da sala abaixo para se juntar aos outros jogadores.
            </p>
          </div>

          {/* Form / Input da Sala */}
          <div className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="Digite o código da sala..." 
                value={CodigoSala}
                onChange={(e) => setCodigoSala(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEntrarSala()}
                className="w-full bg-zinc-950/90 border border-zinc-800 rounded-2xl px-5 py-4 text-center text-lg tracking-widest uppercase font-mono text-cyan-300 placeholder-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
              />
            </div>

            <button 
              onClick={handleEntrarSala}
              className="w-full py-4 px-6 bg-fuchsia-500 hover:bg-fuchsia-400 text-zinc-950 font-black rounded-xl text-sm shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.7)] transition-all transform active:scale-95"
            >
              Entrar na Sala
            </button>
          </div>

        </div>
      </main>

      {/* RODAPÉ */}
      <footer className="py-4 text-center text-xs text-zinc-600 relative z-10">
        © 2026 Echo Palace Casino. Jogue com responsabilidade.
      </footer>

    </div>
  );
}

export default Menu;