import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { fetchComAuth } from "../services/api";
import type { UserProfile } from "../services/interfaces";
import { useLocation, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
let socket: Socket;

function calcularPontos(mao: { valor: string; peso: number }[] = []) {
  if (!mao || mao.length === 0) return 0;
  let soma = 0;
  let ases = 0;

  for (const carta of mao) {
    soma += carta.peso;
    if (carta.valor === "A") ases++;
  }

  while (soma > 21 && ases > 0) {
    soma -= 10;
    ases--;
  }

  return soma;
}

export default function MesaBlackjack() {
  const [sala, setSala] = useState<any>(null);
  const [meuSocketId, setMeuSocketId] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [apostaInicial, setApostaInicial] = useState<number>(50);

  const location = useLocation();
  const navigate = useNavigate();
  const codigoSala = location.state?.codigoSala;

  // 1. Carregar Perfil do Usuário
  useEffect(() => {
    async function carregarPerfil() {
      try {
        const response = await fetchComAuth("/api/perfil");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, [navigate]);

  // 2. Conectar ao Socket
  useEffect(() => {
    if (!user || !codigoSala) return;

    socket = io(BACKEND_URL, {
      extraHeaders: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    socket.on("connect", () => {
      setMeuSocketId(socket.id ?? "");
      socket.emit("entrar_sala", {
        salaId: codigoSala,
        nomeJogador: user.username,
        userId: user.id,
      });
    });

    socket.on("atualizar_estado", (novaSala) => {
      setSala(novaSala);
    });

    socket.on("erro", (msg) => {
      alert(msg);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [user, codigoSala]);

  const meuJogador = sala?.jogadores?.find((j: any) => j.id === meuSocketId);
  const meuGoldNoBanco = meuJogador?.gold ?? user?.gold ?? 0;

  const ehMinhaVez =
    sala?.status === "jogando" &&
    sala?.jogadores[sala.turnoAtualIndex]?.id === meuSocketId;

  const podeDobrar =
    ehMinhaVez &&
    meuJogador?.mao?.length === 2 &&
    meuGoldNoBanco >= (meuJogador?.aposta ?? 0);

  const podeDividir =
    ehMinhaVez &&
    meuJogador?.mao?.length === 2 &&
    meuJogador?.mao[0]?.valor === meuJogador?.mao[1]?.valor &&
    meuGoldNoBanco >= (meuJogador?.aposta ?? 0);

  const alternarPronto = () => {
    socket.emit("alternar_pronto", {
      salaId: codigoSala,
      aposta: apostaInicial,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="animate-pulse text-sm font-semibold">Carregando perfil...</p>
      </div>
    );
  }

  if (!sala) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="animate-pulse text-sm font-semibold">Entrando na sala {codigoSala}...</p>
      </div>
    );
  }

  const dealerMao = sala.dealer?.mao || [];
  const pontosDealerExibidos =
    sala.status === "jogando" && dealerMao.length > 1
      ? calcularPontos([dealerMao[1]])
      : calcularPontos(dealerMao);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-fuchsia-500 selection:text-zinc-950 flex flex-col justify-between relative overflow-x-hidden pb-24 md:pb-6">
      
      {/* GLOW DE FUNDO NEON */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER DA MESA */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/menu')} 
            className="text-xs text-zinc-400 hover:text-cyan-400 font-bold transition-colors mr-2"
          >
            ← Sair
          </button>
          <span className="text-sm font-black italic tracking-wider text-fuchsia-500">
            SALA <span className="text-cyan-400">#{sala.id}</span>
          </span>
        </div>

        <div className="bg-zinc-900 border border-amber-300/30 px-3 py-1 rounded-xl flex items-center gap-2">
          <span className="text-sm">🪙</span>
          <span className="text-xs font-black text-amber-300">{meuGoldNoBanco}</span>
        </div>
      </header>

      {/* MESA DE JOGO PRINCIPAL */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-6 max-w-6xl mx-auto w-full relative z-10">
        
        {/* MESA DE CASSINO (FELTRO ESCURO C/ BORDA NEON) */}
        <div className="w-full bg-emerald-950/40 border-2 border-emerald-600/30 rounded-t-full rounded-b-[4rem] p-4 sm:p-8 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] relative flex flex-col items-center justify-between min-h-[500px]">
          
          {/* LOBBY / AGUARDANDO */}
          {sala.status === "aguardando" && (
            <PainelAguardando
              jogadores={sala.jogadores}
              apostaInicial={apostaInicial}
              setApostaInicial={setApostaInicial}
              meuJogador={meuJogador}
              meuGoldNoBanco={meuGoldNoBanco}
              alternarPronto={alternarPronto}
            />
          )}

          {/* AREA DO DEALER */}
          <AreaDealer status={sala.status} mao={dealerMao} pontos={pontosDealerExibidos} />

          {/* REGRA IMPRESSA NA MESA */}
          <div className="my-4 text-center">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-emerald-500/40 uppercase">
              Blackjack Pays 3 to 2 • Dealer Must Stand on 17
            </span>
          </div>

          {/* CARDS DOS 7 JOGADORES (CARROSSEL HORIZONTAL NO MOBILE) */}
          <div className="w-full overflow-x-auto snap-x snap-mandatory flex gap-3 sm:gap-4 pb-4 pt-2 justify-start lg:justify-center scrollbar-none">
            {sala.jogadores?.map((j: any, index: number) => {
              const eOJogadorDaVez = index === sala.turnoAtualIndex && sala.status === "jogando";
              const pontos = calcularPontos(j.mao);

              return (
                <div key={j.id} className="snap-center shrink-0">
                  <CardJogador
                    jogador={j}
                    eMeuJogador={j.id === meuSocketId}
                    eOJogadorDaVez={eOJogadorDaVez}
                    pontos={pontos}
                    statusSala={sala.status}
                  />
                </div>
              );
            })}
          </div>

        </div>
      </main>

      {/* BARRA DE AÇÕES (FIXA NO BOTTOM EM MOBILE) */}
      {ehMinhaVez && (
        <PainelAcoes
          salaId={sala.id}
          podeDobrar={podeDobrar}
          podeDividir={podeDividir}
        />
      )}

    </div>
  );
}

/* ============================================================================
   SUB-COMPONENTES
   ============================================================================ */

function PainelAguardando({ jogadores, apostaInicial, setApostaInicial, meuJogador, meuGoldNoBanco, alternarPronto }: any) {
  const prontos = jogadores.filter((j: any) => j.pronto).length;

  return (
    <div className="w-full max-w-md bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-4 rounded-2xl shadow-xl text-center mb-4 z-20">
      <div className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">
        Aguardando Jogadores ({prontos}/{jogadores.length} Prontos)
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl">
          <span className="text-xs text-zinc-400 font-bold">Aposta:</span>
          <input
            type="number"
            value={apostaInicial}
            onChange={(e) => setApostaInicial(Number(e.target.value))}
            disabled={meuJogador?.pronto}
            className="w-16 bg-transparent text-center font-bold text-amber-300 focus:outline-none text-sm"
            min={10}
            max={meuGoldNoBanco}
          />
        </div>

        <button
          onClick={alternarPronto}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-md ${
            meuJogador?.pronto 
              ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20" 
              : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20"
          }`}
        >
          {meuJogador?.pronto ? "Cancelar Pronto ❌" : "Estou Pronto! ✅"}
        </button>
      </div>
    </div>
  );
}

function AreaDealer({ status, mao, pontos }: any) {
  return (
    <div className="flex flex-col items-center mb-2 z-10">
      <div className="bg-zinc-900/90 border border-zinc-800 px-4 py-1 rounded-full mb-3 text-center">
        <span className="text-xs font-bold text-zinc-300">
          DEALER {mao.length > 0 && <span className="text-amber-300 font-black">({pontos} pts)</span>}
        </span>
      </div>

      {/* Mao do Dealer */}
      <div className="flex gap-2 min-h-[70px]">
        {mao.length === 0 ? (
          <div className="w-12 h-16 border-2 border-dashed border-zinc-700/50 rounded-lg" />
        ) : (
          mao.map((carta: any, idx: number) => {
            const eOculta = idx === 0 && status === "jogando";
            return (
              <RenderCarta key={idx} carta={carta} oculta={eOculta} />
            );
          })
        )}
      </div>
    </div>
  );
}

function CardJogador({ jogador, eMeuJogador, eOJogadorDaVez, pontos, statusSala }: any) {
  return (
    <div
      className={`w-36 sm:w-40 p-3 rounded-2xl flex flex-col justify-between transition-all relative ${
        eOJogadorDaVez
          ? "bg-zinc-900/90 border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-105 z-20"
          : eMeuJogador
          ? "bg-zinc-900/80 border border-fuchsia-500/50 shadow-lg"
          : "bg-zinc-900/60 border border-zinc-800"
      }`}
    >
      {/* Header do Card do Jogador */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-bold truncate max-w-[80px] ${eMeuJogador ? "text-fuchsia-400" : "text-zinc-200"}`}>
            {jogador.nome}
          </span>
          {eMeuJogador && <span className="text-[9px] font-black bg-fuchsia-500/20 text-fuchsia-300 px-1.5 py-0.5 rounded">VOCÊ</span>}
        </div>

        {/* Status Pronto no Lobby */}
        {statusSala === "aguardando" && (
          <span className={`text-[10px] font-bold block mb-2 ${jogador.pronto ? "text-emerald-400" : "text-rose-400"}`}>
            {jogador.pronto ? "✅ PRONTO" : "⏳ AGUARDANDO"}
          </span>
        )}

        {/* Info Aposta & Gold */}
        <div className="text-[10px] text-zinc-400 space-y-0.5 mb-2">
          <p className="flex justify-between"><span>Aposta:</span> <strong className="text-amber-300">R${jogador.aposta}</strong></p>
          {statusSala !== "aguardando" && (
            <p className="flex justify-between">
              <span>Pontos:</span> 
              <strong className={pontos > 21 ? "text-rose-500 font-black" : "text-zinc-100"}>
                {pontos} {pontos > 21 && "💥"}
              </strong>
            </p>
          )}
        </div>
      </div>

      {/* Cartas na Mão */}
      <div className="flex gap-1 overflow-x-auto py-1 min-h-[50px] scrollbar-none">
        {jogador.mao?.map((c: any, i: number) => (
          <RenderCarta key={i} carta={c} pequena />
        ))}
      </div>

      {/* Banner de Resultado Final */}
      {statusSala === "finalizado" && jogador.resultadoRodada && (
        <div
          className={`mt-2 p-1 rounded text-[10px] text-center font-bold truncate ${
            jogador.resultadoRodada.multiplicador > 0
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
          }`}
        >
          {jogador.resultadoRodada.resultado}
        </div>
      )}
    </div>
  );
}

{/* SUB-COMPONENTE: DESIGN DE CARTA REALISTA */}
function RenderCarta({ carta, oculta = false, pequena = false }: { carta?: any; oculta?: boolean; pequena?: boolean }) {
  if (oculta) {
    return (
      <div className={`${pequena ? "w-8 h-12" : "w-12 h-16"} bg-gradient-to-br from-indigo-900 to-slate-900 border-2 border-indigo-400/40 rounded-lg shadow-md flex items-center justify-center`}>
        <span className="text-xs">🂠</span>
      </div>
    );
  }

  const ehVermelho = carta?.naipe === "♥" || carta?.naipe === "♦" || carta?.naipe === "h" || carta?.naipe === "d";

  return (
    <div className={`${pequena ? "w-8 h-12 text-xs" : "w-12 h-16 text-sm"} bg-zinc-100 border border-zinc-300 rounded-lg shadow-md flex flex-col justify-between p-1 select-none shrink-0 font-bold ${ehVermelho ? "text-rose-600" : "text-zinc-900"}`}>
      <span className="leading-none text-[10px]">{carta?.valor}</span>
      <span className="text-center text-sm leading-none">{carta?.naipe}</span>
      <span className="leading-none text-[10px] self-end rotate-180">{carta?.valor}</span>
    </div>
  );
}

{/* BARRA FIXA DE AÇÕES */}
function PainelAcoes({ salaId, podeDobrar, podeDividir }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 border-t border-zinc-800 p-3 backdrop-blur-lg shadow-2xl">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
        <button
          onClick={() => socket.emit("acao_hit", { salaId })}
          className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
        >
          Pedir (Hit)
        </button>

        <button
          onClick={() => socket.emit("acao_stand", { salaId })}
          className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold rounded-xl text-xs sm:text-sm border border-zinc-700 transition-all active:scale-95"
        >
          Parar (Stand)
        </button>

        <button
          onClick={() => socket.emit("acao_double", { salaId })}
          disabled={!podeDobrar}
          className={`flex-1 py-3 font-bold rounded-xl text-xs sm:text-sm transition-all active:scale-95 ${
            podeDobrar
              ? "bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-lg shadow-amber-400/20"
              : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"
          }`}
        >
          Dobrar
        </button>

        <button
          onClick={() => socket.emit("acao_split", { salaId })}
          disabled={!podeDividir}
          className={`flex-1 py-3 font-bold rounded-xl text-xs sm:text-sm transition-all active:scale-95 ${
            podeDividir
              ? "bg-fuchsia-500 hover:bg-fuchsia-400 text-zinc-950 shadow-lg shadow-fuchsia-500/20"
              : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"
          }`}
        >
          Dividir
        </button>
      </div>
    </div>
  );
}