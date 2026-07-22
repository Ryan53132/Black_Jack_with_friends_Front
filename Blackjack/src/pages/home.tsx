import { useState } from 'react';
import {socket} from '../App.tsx';
import { useNavigate } from 'react-router-dom';

export default function BlackjackLanding() {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();
  const handleJoin = () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    socket.emit("entrar_na_sala",{usuario: playerName,sala: roomCode})
    navigate("/dashboard", { state: { playerName, roomCode } });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center px-6 py-10 font-sans selection:bg-emerald-500 selection:text-black relative overflow-hidden">
      
      {/* Glows de Fundo para o Clima de Cassino Escuro */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-950/30 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-amber-900/20 blur-[120px] rounded-full pointer-events-none" />

      {/* 1. TÍTULO (NO TOPO) */}
      <header className="relative z-10 text-center space-y-3 max-w-xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Multiplayer Privado
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center font-bold text-slate-950 text-2xl shadow-lg shadow-emerald-500/20">
            ♠
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            BLACKJACK <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">21</span>
          </h1>
        </div>

        <p className="text-slate-400 text-sm sm:text-base">
          Entre com seu nome e o código da sala para começar a rodada.
        </p>
      </header>

      {/* 2. CAMPOS DE DADOS (NO MEIO) */}
      <main className="relative z-10 w-full max-w-md my-8">
        <div className="bg-slate-900/70 backdrop-blur-md p-8 rounded-3xl border border-slate-800/80 shadow-2xl shadow-black/80">
          <form onSubmit={handleJoin} className="space-y-5">
            {/* Input Nome */}
            <div className="space-y-1.5">
              <label htmlFor="playerName" className="text-xs font-bold uppercase tracking-wider text-slate-400 block pl-1">
                Seu Nome
              </label>
              <input
                id="playerName"
                type="text"
                placeholder="Como quer ser chamado?"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={15}
                className="w-full bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-600 px-4 py-3.5 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-base"
                required
              />
            </div>

            {/* Input Código da Sala */}
            <div className="space-y-1.5">
              <label htmlFor="roomCode" className="text-xs font-bold uppercase tracking-wider text-slate-400 block pl-1">
                Código da Sala
              </label>
              <input
                id="roomCode"
                type="text"
                placeholder="EX: A2B9"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-600 px-4 py-3.5 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono uppercase text-center font-bold tracking-widest text-xl"
                required
              />
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={!playerName.trim() || !roomCode.trim()}
              className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-extrabold text-lg hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-950/60 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              Entrar na Sala
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </form>
        </div>
      </main>

      {/* 3. CARTAS NO TEMA ESCURO (EM BAIXO) */}
      <footer className="relative z-10 w-full flex flex-col items-center">
        <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-lg">
          
          {/* Carta 1: As de Espadas (Estilo Dark Gold) */}
          <div className="w-24 h-36 sm:w-28 sm:h-40 rounded-xl bg-slate-900 border-2 border-amber-500/40 shadow-2xl flex flex-col justify-between p-3 transform -rotate-12 hover:-rotate-6 transition-transform duration-300 group">
            <div className="flex flex-col">
              <span className="text-amber-400 font-black text-xl leading-none">A</span>
              <span className="text-amber-400 text-2xl font-bold -mt-1">♠</span>
            </div>
            <div className="self-center text-3xl text-amber-400/80 group-hover:scale-125 transition-transform">♠</div>
            <span className="text-amber-400 font-black text-xl rotate-180 self-end leading-none">A</span>
          </div>

          {/* Carta 2: Valete (Estilo Dark Neon Crimson) */}
          <div className="w-24 h-36 sm:w-28 sm:h-40 rounded-xl bg-slate-900 border-2 border-red-500/40 shadow-2xl flex flex-col justify-between p-3 transform -rotate-3 hover:rotate-0 transition-transform duration-300 z-10 group">
            <div className="flex flex-col">
              <span className="text-red-500 font-black text-xl leading-none">J</span>
              <span className="text-red-500 text-2xl font-bold -mt-1">♥</span>
            </div>
            <div className="self-center text-3xl text-red-500/80 group-hover:scale-125 transition-transform">♥</div>
            <span className="text-red-500 font-black text-xl rotate-180 self-end leading-none">J</span>
          </div>

          {/* Carta 3: Verso/Misteriosa (Estilo Dark Pattern) */}
          <div className="w-24 h-36 sm:w-28 sm:h-40 rounded-xl bg-slate-900 border-2 border-emerald-500/40 shadow-2xl flex items-center justify-center p-2 transform rotate-12 hover:rotate-6 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute inset-2 border border-slate-800 rounded-lg bg-slate-950 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl group-hover:rotate-45 transition-transform">
                21
              </div>
            </div>
          </div>

        </div>

        <p className="text-slate-600 text-xs mt-6 font-medium">
          Blackjack Friends • Feito para jogar em grupo
        </p>
      </footer>

    </div>
  );
}