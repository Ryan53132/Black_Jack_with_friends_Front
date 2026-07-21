import { AppRoutes } from './routes/routes';

import { io } from 'socket.io-client';

function App() {

  // Conectando ao backend que criamos no passo 1
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const socket = io(BACKEND_URL, {
    extraHeaders: {
      "ngrok-skip-browser-warning": "true"
    }
  });

  // Ouvindo o evento nativo de conexão
  socket.on("connect", () => {
    console.log("Conectado ao servidor! Meu ID é:", socket.id);
  });

  // Ouvindo o evento que o servidor emite
  socket.on("mensagem_do_servidor", (dados:any) => {
    console.log("O servidor disse:", dados);
  });

  // Suponha que você tenha um botão no HTML: <button id="enviar">Enviar</button>
  document.getElementById('enviar')?.addEventListener('click', () => {
    // Emitindo um evento para o servidor
    socket.emit("mensagem_do_cliente", { texto: "E aí, servidor?" });
  });

  return (
    <div>
      <input type="text" id="enviar" />
      <button id="enviar">Enviar</button>
      <br />
      <br />
      <AppRoutes />
    </div>
  );
}

export default App;