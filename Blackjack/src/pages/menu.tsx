import { useEffect, useState } from 'react';
import { fetchComAuth } from "../services/api";
import { type UserProfile } from '../services/interfaces';
import {logout} from '../services/api';
import { useNavigate } from 'react-router-dom';

function Menu() {
  const [CodigoSala, setCodigoSala] = useState('');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleLogout = async () => {
    logout(); // Limpa o token da memória
  };

  const handleEntrarSala = () => {
    navigate(`/jogo/${CodigoSala}`, { state: { codigoSala: CodigoSala } });
  }

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const response = await fetchComAuth("/api/perfil");
        if (response.ok) {
          const data = await response.json();
          // 💡 data.user contém { id, username, gold }
          setUser(data.user);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, []);

  if (loading) return <p>Carregando perfil...</p>;

  return (
    <>
      <h1>Bem-vindo! {user?.username} gold: {user?.gold}</h1>
      <input 
        type="text" 
        placeholder="Digite o código da sala..." 
        value={CodigoSala}
        onChange={(e) => setCodigoSala(e.target.value)}
      />
      <button onClick={handleEntrarSala}>Entrar na Sala</button>
      <button onClick={handleLogout}>Sair</button>
    </>
  );
}

export default Menu;