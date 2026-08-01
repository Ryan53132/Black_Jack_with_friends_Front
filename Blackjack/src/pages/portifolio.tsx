import {Link} from 'react-router-dom';
export default function Portfolio() {
  // Exemplo de projetos para a seção de showcase
  const projetos = [
    {
      titulo: "Echo Palace - Casino & Blackjack",
      categoria: "Fullstack / WebSockets",
      descricao: "Cassino online em tempo real com mesas de Blackjack multijogador (até 7 jogadores), WebSockets via Socket.io e autenticação JWT.",
      techs: ["React", "TypeScript", "Node.js", "Socket.io", "Tailwind CSS"],
      destaque: true,
      linkDemo: "#",
      linkGithub: "https://github.com/Ryan53132/Black_Jack_with_friends_Front",
    },
    {
      titulo: "API Rest & Auth Engine",
      categoria: "Backend",
      descricao: "Sistema completo de autenticação, controle de saldo e carteira virtual para plataforma com validação rigorosa.",
      techs: ["Node.js", "Express", "JWT", "PostgreSQL", "Refresh Tokens"],
      destaque: false,
      linkDemo: "#",
      linkGithub: "https://github.com/Ryan53132/Black_Jack_with_friends_Backend",
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-fuchsia-500 selection:text-zinc-950 relative overflow-x-hidden">
      
      {/* Luzes Neon de Fundo */}
      <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[25rem] h-[25rem] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-6 lg:px-12 py-4 flex items-center justify-between">
        <a href="#" className="group">
          <span 
            className="text-2xl font-black italic tracking-wider text-fuchsia-500 drop-shadow-[0_0_12px_rgba(217,70,239,0.6)] group-hover:drop-shadow-[0_0_18px_rgba(217,70,239,0.9)] transition-all"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Dev <span className="text-cyan-400">Portfolio</span>
          </span>
        </a>

        <nav className="items-center gap-6 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <Link to="/" className="px-4 py-2 bg-fuchsia-500 text-zinc-950 rounded-xl hover:bg-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.4)] transition-all">Voltar</Link>
        </nav>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="px-6 lg:px-12 py-20 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        <div className="flex-1 text-center md:text-left">
          
          <div className="inline-block px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-bold uppercase tracking-wider mb-4">
            🚀 Desenvolvedor Fullstack
          </div>
          
          <h1 
            className="text-4xl sm:text-6xl font-black italic leading-tight text-zinc-100 mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Criando experiências digitais <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">interativas e modernas.</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 mb-8 max-w-xl">
            Sou um estudante de desenvolvimento que gosta de unir o útil ao divertido: crio aplicações e jogos interativos em tempo real enquanto me aprofundo em boas práticas de segurança e autenticação.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <a 
              href="https://github.com/Ryan53132?tab=repositories" 
              className="px-6 py-3.5 bg-fuchsia-500 hover:bg-fuchsia-400 text-zinc-950 font-black rounded-xl text-sm shadow-[0_0_20px_rgba(217,70,239,0.5)] transition-all transform active:scale-95"
            >
              Ver Projetos
            </a>
            <a 
              href="https://github.com/Ryan53132" 
              className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-cyan-400 font-bold rounded-xl text-sm transition-all"
            >
              Entrar em Contato
            </a>
          </div>
        </div>

        {/* Card de Apresentação / Avatar */}
        <div className="w-full max-w-sm bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-2xl relative text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-fuchsia-600 to-cyan-400 mx-auto mb-4 p-1 shadow-[0_0_25px_rgba(217,70,239,0.5)] flex items-center justify-center">
            <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center font-black text-2xl text-cyan-400">
              <img src="https://imgs.search.brave.com/NWxguuGz2ZB1j6chxkRSL9LL1vbfV-MuYb71VeAogt8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmlt/Z2ZsaXAuY29tLzIx/ZHI1NS5qcGc" alt="Avatar" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-zinc-100">Ryan Araujo dos Santos</h3>
          <p className="text-xs text-zinc-400 mb-4">Fullstack Engineer</p>

          <div className="flex justify-center gap-2 pt-4 border-t border-zinc-800">
            <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-[10px] text-zinc-300 font-bold">React</span>
            <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-[10px] text-zinc-300 font-bold">Node.js</span>
            <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-[10px] text-zinc-300 font-bold">Socket.io</span>
          </div>
        </div>
      </section>

      {/* ================= PROJETOS EM DESTAQUE ================= */}
      <section id="projetos" className="px-6 lg:px-12 py-16 max-w-6xl mx-auto relative z-10">
        
        <div className="mb-12 text-center">
          <h2 
            className="text-3xl sm:text-4xl font-black italic text-zinc-100 mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Projetos em <span className="text-cyan-400">Destaque</span>
          </h2>
          <p className="text-xs text-zinc-400">Alguns dos meus trabalhos recentes e aplicações completas.</p>
          <p className="text-zinc-600 text-xs">Vulgo este projeto.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projetos.map((proj, idx) => (
            <div 
              key={idx}
              className={`bg-zinc-900/80 backdrop-blur-xl border p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col justify-between transition-all hover:border-fuchsia-500/40 ${
                proj.destaque ? 'border-fuchsia-500/30 shadow-[0_0_30px_rgba(217,70,239,0.1)]' : 'border-zinc-800'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">{proj.categoria}</span>
                  {proj.destaque && (
                    <span className="px-2 py-0.5 bg-fuchsia-500/20 text-fuchsia-300 text-[10px] font-black rounded-full border border-fuchsia-500/40">
                      EM DESTAQUE
                    </span>
                    
                  )}
                </div>

                <h3 
                  className="text-2xl font-bold italic text-zinc-100 mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {proj.titulo}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
                  {proj.descricao}
                </p>

                {/* Techs */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {proj.techs.map((t, i) => (
                    <span key={i} className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-zinc-300 text-[10px] font-bold rounded-lg">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex items-center gap-4 pt-4 border-t border-zinc-800/80">
                <a href={proj.linkGithub} className="text-xs font-bold text-fuchsia-400 hover:text-fuchsia-300 transition-colors flex items-center gap-1">
                  Repositório GitHub →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HABILIDADES / STACK ================= */}
      <section id="habilidades" className="px-6 lg:px-12 py-16 max-w-4xl mx-auto relative z-10">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl text-center">
          <h2 
            className="text-2xl sm:text-3xl font-black italic text-zinc-100 mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Tecnologias & Ferramentas
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['React / Next.js', 'TypeScript', 'Node.js / Express', 'Socket.io', 'Tailwind CSS', 'PostgreSQL / SQL', 'REST & WebSockets', 'Git / GitHub'].map((skill, index) => (
              <div key={index} className="p-4 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl text-xs font-bold text-zinc-300 hover:border-cyan-400/40 transition-all">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="contato" className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500 relative z-10">
        <p className="mb-2">© 2026 Desenvolvido com React, Tailwind CSS & Gemini.</p>
        <p className="text-zinc-600">Me contrata ai po, é dificil faze isso aqui.</p>
      </footer>

    </div>
  );
}