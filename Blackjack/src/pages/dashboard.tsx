import { useState, useEffect } from 'react';
import { socket, getnome } from '../App.tsx';

interface MensagemData {
  autor: string;
  texto: string;
}

function Dashboard() {
  // 1. Estados para o texto do input e para a lista de mensagens
  const [mensagemTexto, setMensagemTexto] = useState('');
  const [mensagens, setMensagens] = useState<MensagemData[]>([]);

  // 2. Escutar mensagens do Socket usando useEffect
  useEffect(() => {
    const escutarMensagem = (dados: MensagemData) => {
      // Adiciona a nova mensagem ao final da lista existente
      setMensagens((mensagensAnteriores) => [...mensagensAnteriores, dados]);
    };

    socket.on('receber_mensagem', escutarMensagem);

    // Limpeza: remove o ouvinte quando o componente for desmontado
    // para evitar mensagens duplicadas!
    return () => {
      socket.off('receber_mensagem', escutarMensagem);
    };
  }, []);

  // 3. Função para enviar a mensagem
  const handleEnviarMensagem = () => {
    const textoLimpo = mensagemTexto.trim();

    if (textoLimpo !== '') {
      const novaMensagem: MensagemData = {
        autor: getnome(),
        texto: textoLimpo,
      };

      socket.emit('enviar_mensagem', novaMensagem);
      setMensagemTexto(''); // Limpa o input após enviar
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      {/* Área de Mensagens Recebidas */}
      <div 
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '200px',
          overflowY: 'auto',
          marginBottom: '10px',
        }}
      >
        {mensagens.map((msg, index) => (
          <p key={index} style={{ margin: '5px 0' }}>
            <strong>{msg.autor}:</strong> {msg.texto}
          </p>
        ))}
      </div>

      {/* Formulário de Envio */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={mensagemTexto}
          onChange={(e) => setMensagemTexto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleEnviarMensagem()}
        />
        <button onClick={handleEnviarMensagem}>Enviar</button>
      </div>
    </div>
  );
}

export default Dashboard;