import { Link} from 'react-router-dom';

export default function BlackjackLanding() {
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-fuchsia-500 selection:text-zinc-950 flex flex-col justify-between">
      
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-6 lg:px-12 py-5 flex items-center justify-between">
        
        {/* LOGO ECHO PALACE COM FONTE DE JAZZ / SERIFADA */}
        <Link to="/" className="flex items-center gap-2 group">
          <span 
            className="text-2xl sm:text-3xl font-black italic tracking-wider text-fuchsia-500 drop-shadow-[0_0_12px_rgba(217,70,239,0.6)] group-hover:drop-shadow-[0_0_18px_rgba(217,70,239,0.9)] transition-all"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Echo <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">Palace</span>
          </span>
        </Link>

        {/* LINKS DE AUTENTICAÇÃO */}
        <div className="flex items-center gap-3">
          <Link 
            to="/login" 
            className="px-4 py-2 rounded-xl text-cyan-400 font-bold border border-cyan-400/40 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all text-sm"
          >
            Login
          </Link>

          <Link 
            to="/register" 
            className="px-5 py-2 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 text-zinc-950 font-extrabold text-sm shadow-[0_0_18px_rgba(217,70,239,0.5)] hover:shadow-[0_0_25px_rgba(217,70,239,0.8)] transition-all transform hover:-translate-y-0.5"
          >
            Register
          </Link>
        </div>
      </header>


      {/* ================= HERO SECTION ================= */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-16 pb-20 px-6 lg:px-12 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-zinc-950 to-zinc-950">
          
          {/* Badge Neon Jazz */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-300/10 border border-amber-300/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_10px_rgba(252,211,77,0.15)]">
            🎷 Jazz Club & Casino Nights
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-100 max-w-4xl mx-auto leading-tight mb-6">
            Bem-vindo ao <br />
            <span 
              className="italic text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-400 to-cyan-400 drop-shadow-[0_0_20px_rgba(217,70,239,0.4)]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Echo Palace
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            Entre no cassino mais exclusivo da noite. Slots de alta volatilidade, jogos crash ao vivo e recompensas em tempo real com a elegância do jazz.
          </p>

          {/* Botão de Registro */}
          <div className="flex justify-center">
            <Link 
              to="/register" 
              className="px-8 py-3.5 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 text-zinc-950 font-black text-base shadow-[0_0_25px_rgba(217,70,239,0.6)] hover:shadow-[0_0_35px_rgba(217,70,239,0.9)] transition-all transform hover:-translate-y-1"
            >
              Criar Conta e Jogar
            </Link>
          </div>
        </section>

        {/* ================= BENEFÍCIOS ================= */}
        <section className="px-6 lg:px-12 py-12 max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-zinc-100 mb-8 flex items-center gap-2 border-l-4 border-fuchsia-500 pl-3">
            Por que escolher o Echo Palace?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 rounded-2xl">
              <div className="text-cyan-400 text-2xl mb-2">⚡</div>
              <h3 className="text-zinc-100 font-bold mb-1">Pagamentos Instantâneos</h3>
              <p className="text-zinc-400 text-sm">Receba Seus Lucros em Segundos Direto no PIX sem Burocracia.</p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 rounded-2xl">
              <div className="text-cyan-400 text-2xl mb-2">🛡️</div>
              <h3 className="text-zinc-100 font-bold mb-1">Plataforma Segura</h3>
              <p className="text-zinc-400 text-sm">Criptografia Ponta a Ponta para Garantir a Segurança dos Seus Dados.</p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 rounded-2xl">
              <div className="text-cyan-400 text-2xl mb-2">🎁</div>
              <h3 className="text-zinc-100 font-bold mb-1">Bônus Exclusivo</h3>
              <p className="text-zinc-400 text-sm">Ganhe Até 100% no Primeiro Depósito + Rodadas Grátis.</p>
            </div>
          </div>
        </section>
      </main>


      {/* ================= RODAPÉ ================= */}
      <footer className="bg-zinc-900/60 border-t border-zinc-800/80 px-6 py-8 text-center text-xs text-zinc-500">
        <p className="mb-2 font-semibold text-zinc-400">
          © 2026 Echo Palace Casino. Todos os direitos reservados.
        </p>
        <p>
          Jogo responsável. Proibido para menores de 18 anos.
        </p>
      </footer>

    </div>
  );
}