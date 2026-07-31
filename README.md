# 🎰 Echo Palace — Real-Time Multiplayer Blackjack

> **Aplicação Full-Stack de Cassino em Tempo Real** desenvolvida para demonstrar arquitetura orientada a eventos (WebSockets), gerenciamento de estado assíncrono e interfaces reativas modernas.

[![Live Demo](https://img.shields.io/badge/🌐_Acessar_Aplicação-Live_Deploy-fuchsia?style=for-the-badge)](https://SEU-LINK-DO-DEPLOY-AQUI.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🔗 Link do Projeto no Ar

💻 **Acesse a aplicação ao vivo:** [https://SEU-LINK-DO-DEPLOY-AQUI.com](https://SEU-LINK-DO-DEPLOY-AQUI.com)

---

## 🎯 Sobre o Projeto & Desafios Técnicos

Este projeto foi construído para simular a experiência real de uma mesa de cassino multiplayer com **Blackjack (21)**. O maior desafio técnico foi garantir que múltiplos jogadores pudessem interagir simultaneamente na mesma sala com sincronização perfeita de estado e baixíssima latência.

### Key Highlights Técnicos:

1. **Arquitetura Event-Driven (Socket.io):** Toda a regra de negócio do jogo roda no servidor. O front-end emite eventos (ações do jogador) e reage às atualizações do estado centralizado da mesa via WebSockets.
2. **Modo Espectador Não-Bloqueante:** Em vez de recusar conexões durante uma partida em andamento, o sistema aceita novos jogadores em modo de observação (`espectador`) e os integra automaticamente no próximo round assim que a mesa reseta.
3. **Resiliência a Desconexões:** Trata a saída voluntária (navegação por abas/botões) e involuntária (quedas de conexão/fechamento de navegador), garantindo que a partida dos outros jogadores continue sem travamentos de turno.
4. **UI/UX imersiva:** Interface moderna em estilo cassino neon, desenvolvida em **Tailwind CSS**, responsiva para dispositivos móveis e desktop.
5. **Nivel 2 de OWASP top 10
---

## 🛠️ Tech Stack & Arquitetura

### **Front-end**
* **React + Vite** (Single Page Application com TypeScript)
* **Tailwind CSS** (Estilização utilitária, suporte a temas escuros/neon e layouts flexíveis)
* **Socket.io-Client** (Conexão persistente via WebSocket)
* **React Router DOM** (Roteamento client-side)

### **Back-end**
* **Node.js & Express**
* **Socket.io** (Orquestração de salas, gerenciamento de turnos e temporizadores)
* **JWT (JSON Web Tokens)** (Autenticação de usuários)
* **SQLite / DB** (Persistência de saldos e credenciais)

```
src/
├── assets/          # Imagens e vetores do cassino
├── context/         # AuthContext.tsx (Gerenciamento global de autenticação)
├── pages/           # home.tsx, login.tsx, register.tsx, menu.tsx, jogo.tsx
├── routes/          # routes.tsx (Mapeamento de rotas SPA)
└── services/        # api.ts (Axios/Fetch), interfaces.ts (Tipagens TypeScript)
```

```
/
├── Main.js              # Ponto de entrada do servidor Express & HTTP
├── aRoutes.js           # Endpoints de login, registro e perfil
├── aSocket.js           # Eventos WebSocket, salas e turnos do Blackjack
├── authMiddleware.js    # Validação de tokens JWT
├── db.js & database.sqlite # Conexão e armazenamento SQLite
└── aSchemas.js          # Schemas de validação de dados
```

---

## 🧠 Fluxo de Funcionamento da Mesa

```text
       [ Jogador entra na sala ]
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 (Partida Ocorrida)    (Sala Aguardando)
        │                   │
 Status: Espectador 👁️   Status: Aguardando ⏳
 (Assiste à rodada)    (Define aposta & dá Pronto)
        │                   │
        └─────────┬─────────┘
                  ▼
        [ Distribuição Inicial ]
                  │
    [ Turnos: Hit / Stand / Double / Split ]
                  │
        [ Turno do Dealer (>=17) ]
                  │
   [ Apuração do Vencedor & Reset ] ➔ (Espectadores viram Jogadores)
```
🎮 Funcionalidades do Jogo
Ações Clássicas de Blackjack: Pedir cartas (Hit), Parar (Stand), Dobrar aposta (Double) e Dividir pares (Split).

Dealer Autônomo: Regras clássicas do cassino onde o dealer revela a carta oculta e compra até atingir 17 pontos ou estourar.

Cálculo de Pontuação Dinâmico: Tratamento correto da pontuação flexível da carta Ás (1 ou 11 pontos).

Gestão de Banca (Gold): Saldo atualizado em tempo real no banco de dados e reposição automática para garantir que o usuário continue jogando.

👤 Autor
Desenvolvido por Ryan Araújo dos Santos como parte do meu portfólio de engenharia de software.

LinkedIn: [Ryan Araújo dos Santos](www.linkedin.com/in/ryan-araujo-dos-santos-8391b927b)

Email: ryan53132@gmail.com
