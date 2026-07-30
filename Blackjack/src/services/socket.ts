/*// src/services/socket.ts
import { io, Socket } from "socket.io-client";
import { getAccessToken } from "./api";

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:3000";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      autoConnect: false, // Vamos conectar manualmente quando entrar no jogo
      credentials: true,
      auth: (cb) => {
        // Envia o Access Token da memória para o Socket.io autenticar no handshake
        cb({ token: getAccessToken() });
      },
    });
  }
  return socket;
};*/