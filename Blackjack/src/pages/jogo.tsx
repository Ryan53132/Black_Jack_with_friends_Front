import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { fetchComAuth } from "../services/api";
import type { UserProfile } from "../services/interfaces";
import { useLocation, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
let socket: Socket;

// 🧮 Helper para calcular pontuação das cartas
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

  // Regras e Elegibilidade
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

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Carregando perfil...</p>;
  if (!sala) return <p style={{ textAlign: "center", marginTop: "50px" }}>Entrando na sala {codigoSala}...</p>;

  // Pontos visíveis do Dealer
  const dealerMao = sala.dealer?.mao || [];
  const pontosDealerExibidos =
    sala.status === "jogando" && dealerMao.length > 1
      ? calcularPontos([dealerMao[1]]) // Esconde o valor da 1ª carta oculta
      : calcularPontos(dealerMao);

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Mesa - Sala {sala.id}</h2>
        <div>🪙 Seu Gold: <strong>{meuGoldNoBanco}</strong></div>
      </header>

      {/* LOBBY / STATUS AGUARDANDO */}
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

      {/* ÁREA DO DEALER */}
      <AreaDealer status={sala.status} mao={dealerMao} pontos={pontosDealerExibidos} />

      {/* CARDS DOS JOGADORES NA MESA */}
      <div style={{ display: "flex", gap: "15px", marginTop: "20px", overflowX: "auto", paddingBottom: "10px" }}>
        {sala.jogadores?.map((j: any, index: number) => {
          const eOJogadorDaVez = index === sala.turnoAtualIndex && sala.status === "jogando";
          const pontos = calcularPontos(j.mao);

          return (
            <CardJogador
              key={j.id}
              jogador={j}
              eMeuJogador={j.id === meuSocketId}
              eOJogadorDaVez={eOJogadorDaVez}
              pontos={pontos}
              statusSala={sala.status}
            />
          );
        })}
      </div>

      {/* CONTROLES / PAINEL DE AÇÃO */}
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
   SUB-COMPONENTES ORGANIZADOS
   ============================================================================ */

function PainelAguardando({ jogadores, apostaInicial, setApostaInicial, meuJogador, meuGoldNoBanco, alternarPronto }: any) {
  const prontos = jogadores.filter((j: any) => j.pronto).length;

  return (
    <div style={{ marginBottom: "20px", padding: "15px", background: "#f0f0f0", borderRadius: "8px" }}>
      <h3>Aguardando Jogadores ({prontos}/{jogadores.length} Prontos)</h3>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <label>
          Sua Aposta Inicial:
          <input
            type="number"
            value={apostaInicial}
            onChange={(e) => setApostaInicial(Number(e.target.value))}
            disabled={meuJogador?.pronto}
            style={{ marginLeft: "10px", padding: "6px", width: "80px", borderRadius: "4px" }}
            min={10}
            max={meuGoldNoBanco}
          />
        </label>

        <button
          onClick={alternarPronto}
          style={{
            padding: "8px 16px",
            backgroundColor: meuJogador?.pronto ? "#dc3545" : "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {meuJogador?.pronto ? "Cancelar Pronto ❌" : "Estou Pronto! ✅"}
        </button>
      </div>
    </div>
  );
}

function AreaDealer({ status, mao, pontos }: any) {
  return (
    <div style={{ background: "#1b2a4a", color: "#fff", padding: "15px", borderRadius: "8px" }}>
      <h3>
        Dealer {mao.length > 0 && <span style={{ color: "#ffd700" }}>({pontos} pts)</span>}
      </h3>
      <div style={{ display: "flex", gap: "10px", fontSize: "1.3rem" }}>
        {mao.map((carta: any, idx: number) => (
          <div
            key={idx}
            style={{
              padding: "8px 12px",
              background: "#fff",
              color: "#000",
              borderRadius: "5px",
              border: "1px solid #999",
            }}
          >
            {idx === 0 && status === "jogando" ? "🂠 Oculta" : `${carta.valor}${carta.naipe}`}
          </div>
        ))}
      </div>
    </div>
  );
}

function CardJogador({ jogador, eMeuJogador, eOJogadorDaVez, pontos, statusSala }: any) {
  return (
    <div
      style={{
        border: eOJogadorDaVez ? "3px solid gold" : "1px solid #ccc",
        boxShadow: eOJogadorDaVez ? "0 0 10px rgba(255,215,0,0.5)" : "none",
        padding: "15px",
        borderRadius: "8px",
        minWidth: "180px",
        background: eMeuJogador ? "#f0f8ff" : "#fff",
      }}
    >
      <h4 style={{ margin: "0 0 10px 0" }}>
        {jogador.nome} {eMeuJogador ? "(Você)" : ""}
      </h4>

      {statusSala === "aguardando" && (
        <p style={{ fontWeight: "bold", color: jogador.pronto ? "green" : "red" }}>
          {jogador.pronto ? "✅ PRONTO" : "⏳ AGUARDANDO"}
        </p>
      )}

      <p style={{ margin: "4px 0" }}>🪙 Gold: {jogador.gold}</p>
      <p style={{ margin: "4px 0" }}>🎲 Aposta: R$ {jogador.aposta}</p>

      {statusSala !== "aguardando" && (
        <>
          <p style={{ margin: "4px 0" }}>
            Status: <strong>{jogador.status}</strong>
          </p>
          <p style={{ margin: "4px 0", fontWeight: "bold", color: pontos > 21 ? "red" : "#333" }}>
            Pontos: {pontos} {pontos > 21 ? "💥" : ""}
          </p>
        </>
      )}

      {/* Mão de Cartas */}
      <div style={{ marginTop: "10px" }}>
        <strong>Mão:</strong>
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "5px" }}>
          {jogador.mao?.map((c: any, i: number) => (
            <span
              key={i}
              style={{
                padding: "2px 6px",
                background: "#eee",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              {c.valor}{c.naipe}
            </span>
          ))}
        </div>
      </div>

      {/* Banner de Resultado Final da Rodada */}
      {statusSala === "finalizado" && jogador.resultadoRodada && (
        <div
          style={{
            marginTop: "10px",
            padding: "5px",
            borderRadius: "4px",
            fontSize: "0.85rem",
            textAlign: "center",
            fontWeight: "bold",
            background: jogador.resultadoRodada.multiplicador > 0 ? "#d4edda" : "#f8d7da",
            color: jogador.resultadoRodada.multiplicador > 0 ? "#155724" : "#721c24",
          }}
        >
          {jogador.resultadoRodada.resultado}
        </div>
      )}
    </div>
  );
}

function PainelAcoes({ salaId, podeDobrar, podeDividir }: any) {
  return (
    <div
      style={{
        marginTop: "30px",
        padding: "15px",
        border: "2px solid #007bff",
        borderRadius: "8px",
        background: "#eef6ff",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0" }}>🎯 Sua Vez! Escolha a ação:</h3>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={() => socket.emit("acao_hit", { salaId })} style={btnStyle("#007bff")}>
          Pedir (Hit)
        </button>
        <button onClick={() => socket.emit("acao_stand", { salaId })} style={btnStyle("#6c757d")}>
          Parar (Stand)
        </button>
        <button
          onClick={() => socket.emit("acao_double", { salaId })}
          disabled={!podeDobrar}
          style={btnStyle("#ffc107", !podeDobrar)}
        >
          Dobrar (Double)
        </button>
        <button
          onClick={() => socket.emit("acao_split", { salaId })}
          disabled={!podeDividir}
          style={btnStyle("#17a2b8", !podeDividir)}
        >
          Dividir (Split)
        </button>
      </div>
    </div>
  );
}

const btnStyle = (bg: string, disabled = false) => ({
  padding: "10px 18px",
  backgroundColor: disabled ? "#ccc" : bg,
  color: disabled ? "#666" : "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: disabled ? "not-allowed" : "pointer",
  fontWeight: "bold" as const,
});