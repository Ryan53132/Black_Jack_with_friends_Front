import { AppRoutes } from './routes/routes';
import { io, Socket } from 'socket.io-client';


const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:3000';

export const socket: Socket = io(BACKEND_URL, {
  extraHeaders: {
    "ngrok-skip-browser-warning": "true"
  }
});

var meunome: string = "";
export function setnome(nome:string){
  meunome = nome;
}
export function getnome(){
  return meunome;
}

function App() {
  return (
    <div>
      <AppRoutes />
    </div>
  );
}

export default App;