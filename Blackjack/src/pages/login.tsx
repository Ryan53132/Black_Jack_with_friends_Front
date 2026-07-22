import { Link } from 'react-router-dom';
import  {setnome} from '../App.tsx'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


export function Login() {
  const [nome, setNome] = useState('');
  const navigate = useNavigate();

  const handleEntrar = () => {
    const nomeDigitado = nome.trim();

    if (nomeDigitado !== '') {
      // Se precisar salvar o nome em um estado global/pai ou contexto:
      setnome(nomeDigitado);

      // Redireciona para o dashboard
      navigate('/dashboard');
    } else {
      alert('Por favor, digite um nome!');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {/* 1. O value fica ligado ao estado, e o onChange atualiza o estado */}
      <input
        type="text"
        placeholder="Digite seu nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      {/* 2. O clique chama a função diretamente pelo evento do React */}
      <button onClick={handleEntrar}>
        Entrar
      </button>
      <br/>
      <Link to="/">Voltar para Home</Link>
    </div>
  );
}

export default Login;