// services/api.ts

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export async function fetchComAuth(endpoint: string, options: RequestInit = {}) {
  const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:3000";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // 🚨 Se der 401, tenta renovar o token
  if (response.status === 401) {
    try {
      const refreshResponse = await fetch(`${BACKEND_URL}/api/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setAccessToken(data.accessToken);

        // Tenta a requisição original novamente com o novo token
        return await fetch(`${BACKEND_URL}${endpoint}`, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${data.accessToken}`,
          },
          credentials: "include",
        });
      } else {
        // 🚨 FALHA NO REFRESH: Apenas limpa o token em memória.
        // NÃO chame a função logout() aqui para não gerar loop de redirecionamento!
        setAccessToken(null);
      }
    } catch (error) {
      setAccessToken(null);
    }
  }

  return response;
}

// Função de Logout explícito (acionada quando o usuário clica no botão "Sair")
export async function logout() {
  const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:3000";

  try {
    await fetch(`${BACKEND_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Erro ao fazer logout no servidor:", error);
  } finally {
    setAccessToken(null);
    window.location.href = "/login";
  }
}