import { useState, useEffect, useRef } from 'react';
import { socket } from '../App'; // 👈 Removida a extensão .tsx
import { useLocation } from 'react-router-dom'; 
import Draggable from 'react-draggable';

interface MensagemData {
  autor: string;
  texto: string;
}

interface LocationState {
  playerName?: string;
}

function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);
  
  // 👈 Tipagem correta do useRef para HTMLDivElement
  const nodeRef = useRef<HTMLDivElement>(null);

  const [mensagemTexto, setMensagemTexto] = useState('');
  const [mensagens, setMensagens] = useState<MensagemData[]>([]);
  
  // 👈 Tipagem segura para o location state
  const location = useLocation();
  const state = location.state as LocationState | null;

  useEffect(() => {
    const escutarMensagem = (dados: MensagemData) => {
      setMensagens((mensagensAnteriores) => [...mensagensAnteriores, dados]);
    };

    socket.on('notificacao', escutarMensagem);
    socket.on('nova_mensagem', escutarMensagem);

    return () => {
      socket.off('nova_mensagem', escutarMensagem);
      socket.off('notificacao', escutarMensagem);
    };
  }, []);

  const handleEnviarMensagem = () => {
    const textoLimpo = mensagemTexto.trim();

    if (textoLimpo !== '') {
      // 👈 Acesso seguro com fallback se playerName não existir
      const nomeAutor = state?.playerName || 'Jogador';
      socket.emit('mensagem_sala', `${nomeAutor}: ${textoLimpo}`);
      setMensagemTexto('');
    }
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".chat-header" bounds="parent">
      <div 
        ref={nodeRef}
        className="fixed bottom-4 right-4 z-50 w-80 sm:w-80 max-w-[calc(100vw-2rem)] font-sans"
      >
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden flex flex-col">
          
          <div className="chat-header bg-slate-800/90 px-4 py-2.5 flex items-center justify-between cursor-move select-none border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold text-xs">⋮⋮</span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Chat da Mesa
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white text-xs font-bold p-1 rounded-md hover:bg-slate-700/50 transition-colors"
              title={isOpen ? "Minimizar Chat" : "Expandir Chat"}
            >
              {isOpen ? '—' : '◤'}
            </button>
          </div>

          {isOpen && (
            <div className="p-3 flex flex-col gap-3">
              <div className="h-44 overflow-y-auto pr-1 space-y-2 text-xs scrollbar-thin scrollbar-thumb-slate-700">
                {mensagens && mensagens.length > 0 ? (
                  mensagens.map((msg, index) => (
                    <div key={index} className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 break-words">
                      <span className="font-bold text-amber-400">{msg.autor}: </span>
                      <span className="text-slate-200">{msg.texto}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center text-xs py-4">Nenhuma mensagem ainda...</p>
                )}
              </div>

              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Mensagem..."
                  value={mensagemTexto}
                  onChange={(e) => setMensagemTexto(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEnviarMensagem()}
                  className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleEnviarMensagem}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl transition-all shadow-md active:scale-95 shrink-0"
                >
                  Enviar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
}

export default Dashboard;