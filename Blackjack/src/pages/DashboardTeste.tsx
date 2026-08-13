import React, { useState, useEffect } from 'react';

// 1. Interface de tipos
export interface RetanguloItem {
  id: number;
  nome: string;
  dataIni: string; // YYYY-MM-DD
  dataVal: string; // YYYY-MM-DD
  preco: number;
}

interface EdicaoEmLoteForm {
  idInicio: number;
  idFim: number;
  nome: string;
  dataIni: string;
  dataVal: string;
  preco: number;
}

// 2. Auxiliares de Datas
const formatDataHoje = (offsetDias = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDias);
  return d.toISOString().split('T')[0];
};

// 3. Helper para gerar URL da Logo.dev API a partir da primeira palavra
const LOGO_DEV_PUBLIC_KEY = 'pk_d_Jny0EdTT2FfX7Ai-xZAg'; // Substitua pela sua chave pública da Logo.dev em produção

const obterUrlLogoDev = (nomeCompleto: string): string => {
  if (!nomeCompleto) return '';
  // Extrai a primeira palavra (marca)
  const primeiraPalavra = nomeCompleto.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!primeiraPalavra) return '';
  
  // Estrutura oficial da Logo.dev API
  return `https://img.logo.dev/${primeiraPalavra}.com?token=${LOGO_DEV_PUBLIC_KEY}`;
};

// 4. Componente de Imagem com Fallback para Logo.dev
const LogoMarca: React.FC<{ nome: string; tamanho?: 'sm' | 'md' }> = ({ nome, tamanho = 'md' }) => {
  const [temErro, setTemErro] = useState(false);
  const urlLogo = obterUrlLogoDev(nome);

  useEffect(() => {
    setTemErro(false);
  }, [nome]);

  const classesTamanho = tamanho === 'sm' ? 'w-5 h-5 rounded-sm' : 'w-7 h-7 rounded-md';

  if (!urlLogo || temErro) {
    return (
      <div className={`${classesTamanho} bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-[10px] flex-shrink-0 uppercase`}>
        {nome.trim().charAt(0) || '?'}
      </div>
    );
  }

  return (
    <img
      src={urlLogo}
      alt={nome}
      onError={() => setTemErro(true)}
      className={`${classesTamanho} object-contain bg-white p-0.5 border border-slate-100 flex-shrink-0`}
    />
  );
};

// 5. Gerador de Itens de Teste com Marcas Reais
const marcasExemplo = ['Nestle', 'Coca-Cola', 'Danone', 'Sadia', 'Perdigao', 'Ambev', 'Lacta', 'Heineken', 'Bauducco', 'Pepsi'];
const TOTAL_ITENS = 92;

const dadosIniciais: RetanguloItem[] = Array.from({ length: TOTAL_ITENS }, (_, index) => {
  let dataValOffset = 5;
  if (index % 6 === 0) dataValOffset = 0; // Vence hoje (Pisca Vermelho)
  if (index % 6 === 1) dataValOffset = 1; // Vence amanhã (Pisca Amarelo)

  const marca = marcasExemplo[index % marcasExemplo.length];

  return {
    id: index + 1,
    nome: `${marca} Produto Lote ${index + 1}`,
    dataIni: formatDataHoje(-10),
    dataVal: formatDataHoje(dataValOffset),
    preco: parseFloat((Math.random() * 80 + 10).toFixed(2)),
  };
});

// 6. Cálculo de Status de Validade
type StatusValidade = 'vencendo_hoje' | 'vencendo_amanha' | 'normal' | 'vencido';

const calcularStatus = (dataValStr: string): StatusValidade => {
  if (!dataValStr) return 'normal';

  const [anoVal, mesVal, diaVal] = dataValStr.split('-').map(Number);
  const dataVal = new Date(anoVal, mesVal - 1, diaVal).setHours(0, 0, 0, 0);

  const hoje = new Date();
  const hojeTimestamp = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).setHours(0, 0, 0, 0);

  const diffDias = Math.round((dataVal - hojeTimestamp) / (1000 * 60 * 60 * 24));

  if (diffDias === 0) return 'vencendo_hoje';
  if (diffDias === 1) return 'vencendo_amanha';
  if (diffDias < 0) return 'vencido';
  return 'normal';
};

export const DashboardRetangulos: React.FC = () => {
  const [itens, setItens] = useState<RetanguloItem[]>(dadosIniciais);
  
  const [itemSelecionado, setItemSelecionado] = useState<RetanguloItem | null>(null);
  const [modalLoteAberto, setModalLoteAberto] = useState<boolean>(false);

  // Sanfonas
  const [sanfonasAbertas, setSanfonasAbertas] = useState<{ [chave: string]: boolean }>({
    sec1: true,
    sec2: true,
    sec3: true,
    sec4: true,
  });

  const toggleSanfona = (chave: string) => {
    setSanfonasAbertas((prev) => ({ ...prev, [chave]: !prev[chave] }));
  };

  // Formulário em lote
  const [formLote, setFormLote] = useState<EdicaoEmLoteForm>({
    idInicio: 1,
    idFim: 13,
    nome: 'Nestle Leite Integral',
    dataIni: formatDataHoje(0),
    dataVal: formatDataHoje(3),
    preco: 6.89,
  });

  // Divisão dos lotes
  const grupo1 = itens.slice(0, 20);      // IDs 1 a 20
  const grupo2 = itens.slice(20, 28);     // IDs 21 a 28
  const grupo3 = itens.slice(28, 36);     // IDs 29 a 36
  const grupo4 = itens.slice(36, 92);     // IDs 37 a 92 (56 itens - Matriz 7x8)

  const salvarAlteracoesIndividual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemSelecionado) return;
    setItens((prev) =>
      prev.map((item) => (item.id === itemSelecionado.id ? itemSelecionado : item))
    );
    setItemSelecionado(null);
  };

  const salvarEdicaoEmLote = (e: React.FormEvent) => {
    e.preventDefault();
    const menor = Math.min(formLote.idInicio, formLote.idFim);
    const maior = Math.max(formLote.idInicio, formLote.idFim);

    setItens((prev) =>
      prev.map((item) => {
        if (item.id >= menor && item.id <= maior) {
          return {
            ...item,
            nome: formLote.nome,
            dataIni: formLote.dataIni,
            dataVal: formLote.dataVal,
            preco: formLote.preco,
          };
        }
        return item;
      })
    );
    setModalLoteAberto(false);
  };

  const getCardClasses = (dataVal: string) => {
    const status = calcularStatus(dataVal);
    const baseClasses =
      'p-2.5 rounded-lg border text-left cursor-pointer transition transform hover:scale-105 select-none shadow-xs flex flex-col justify-between h-28';

    switch (status) {
      case 'vencendo_hoje':
        return `${baseClasses} bg-red-100 border-red-500 text-red-900 animate-pulse ring-2 ring-red-500`;
      case 'vencendo_amanha':
        return `${baseClasses} bg-yellow-100 border-yellow-500 text-yellow-900 animate-pulse ring-2 ring-yellow-500`;
      case 'vencido':
        return `${baseClasses} bg-gray-200 border-gray-400 text-gray-600 opacity-80`;
      default:
        return `${baseClasses} bg-white border-slate-200 text-slate-800 hover:border-slate-400`;
    }
  };

  const getMiniCardClasses = (dataVal: string) => {
    const status = calcularStatus(dataVal);
    const baseClasses =
      'w-10 h-10 rounded-md border flex flex-col items-center justify-center p-0.5 relative cursor-pointer transition hover:scale-110 select-none shadow-xs flex-shrink-0 overflow-hidden';

    switch (status) {
      case 'vencendo_hoje':
        return `${baseClasses} bg-red-100 border-red-600 animate-pulse ring-2 ring-red-400`;
      case 'vencendo_amanha':
        return `${baseClasses} bg-yellow-100 border-yellow-500 animate-pulse ring-2 ring-yellow-400`;
      case 'vencido':
        return `${baseClasses} bg-gray-300 border-gray-400 opacity-70`;
      default:
        return `${baseClasses} bg-white border-slate-300 hover:bg-slate-50`;
    }
  };

  const renderSecaoSanfona = (
    chave: string,
    titulo: string,
    lista: RetanguloItem[],
    subtitulo: string
  ) => {
    const aberta = sanfonasAbertas[chave];
    const qtdVencendoHoje = lista.filter((i) => calcularStatus(i.dataVal) === 'vencendo_hoje').length;
    const qtdVencendoAmanha = lista.filter((i) => calcularStatus(i.dataVal) === 'vencendo_amanha').length;

    return (
      <div className="mb-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSanfona(chave)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 text-left transition border-b border-slate-200"
        >
          <div className="flex items-center gap-3">
            <span
              className={`transform transition-transform text-slate-400 font-bold ${
                aberta ? 'rotate-90' : 'rotate-0'
              }`}
            >
              ▶
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-800">{titulo}</h3>
              <p className="text-xs text-slate-500">{subtitulo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {qtdVencendoHoje > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 animate-pulse border border-red-200">
                {qtdVencendoHoje} hoje
              </span>
            )}
            {qtdVencendoAmanha > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                {qtdVencendoAmanha} amanhã
              </span>
            )}
            <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-md border">
              {lista.length} itens
            </span>
          </div>
        </button>

        {aberta && (
          <div className="p-4 bg-white">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-3">
              {lista.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setItemSelecionado({ ...item })}
                  className={getCardClasses(item.dataVal)}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] text-slate-400 font-bold">#{item.id}</span>
                      <LogoMarca nome={item.nome} tamanho="sm" />
                    </div>
                    <p className="font-bold text-xs truncate" title={item.nome}>{item.nome}</p>
                    <p className="text-[10px] text-slate-500">Val: {item.dataVal}</p>
                  </div>
                  <p className="text-xs font-bold self-end text-slate-700">
                    R$ {Number(item.preco).toFixed(2)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}
      <header className="mb-6 flex flex-wrap justify-between items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Painel de Monitoramento Geral</h1>
          <p className="text-xs text-slate-500 mt-1">
            Reconhecimento automático de marcas via <strong>Logo.dev API</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setModalLoteAberto(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            ✏️ Editar em Lote (Faixa de IDs)
          </button>

          <div className="hidden sm:flex gap-3 text-xs font-medium border-l pl-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse inline-block" /> Vence Hoje
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse inline-block" /> Vence Amanhã
            </span>
          </div>
        </div>
      </header>

      {/* PREVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Preview 1: Linha Única */}
        <section className="lg:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Preview em Linha: Lotes 1, 2 e 3 (IDs 1 ao 36)
              </h2>
              <span className="text-[11px] text-slate-400">Scroll horizontal ↔</span>
            </div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 pt-1 px-1">
              {itens.slice(0, 36).map((item, idx) => (
                <React.Fragment key={item.id}>
                  {(idx === 20 || idx === 28) && (
                    <div className="h-8 w-[2px] bg-slate-300 mx-1 flex-shrink-0" />
                  )}
                  <button
                    type="button"
                    title={`${item.nome} (ID: #${item.id}) | Val: ${item.dataVal}`}
                    onClick={() => setItemSelecionado({ ...item })}
                    className={getMiniCardClasses(item.dataVal)}
                  >
                    <LogoMarca nome={item.nome} tamanho="sm" />
                    <span className="text-[9px] font-bold text-slate-600 leading-tight">#{item.id}</span>
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Clique no bloquinho para editar o item.</p>
        </section>

        {/* Preview 2: Matriz 7x8 */}
        <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Preview Matriz 7 × 8 (IDs 37 ao 92)
            </h2>
            <span className="text-[11px] font-semibold text-slate-500">56 blocos</span>
          </div>
          
          <div className="grid grid-cols-8 gap-1.5 justify-items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
            {grupo4.map((item) => (
              <button
                key={item.id}
                type="button"
                title={`${item.nome} (ID: #${item.id}) | Val: ${item.dataVal}`}
                onClick={() => setItemSelecionado({ ...item })}
                className={getMiniCardClasses(item.dataVal)}
              >
                <LogoMarca nome={item.nome} tamanho="sm" />
                <span className="text-[9px] font-bold text-slate-600 leading-tight">#{item.id}</span>
              </button>
            ))}
          </div>
        </section>

      </div>

      {/* SANFONAS */}
      <div className="space-y-4">
        {renderSecaoSanfona('sec1', 'Seção 1 (20 Itens)', grupo1, 'Itens do ID 1 ao ID 20')}
        {renderSecaoSanfona('sec2', 'Seção 2 (8 Itens)', grupo2, 'Itens do ID 21 ao ID 28')}
        {renderSecaoSanfona('sec3', 'Seção 3 (8 Itens)', grupo3, 'Itens do ID 29 ao ID 36')}
        {renderSecaoSanfona('sec4', 'Seção 4: Matriz 7x8 (56 Itens)', grupo4, 'Itens do ID 37 ao ID 92')}
      </div>

      {/* Modal 1: Edição Individual */}
      {itemSelecionado && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Editar Item #{itemSelecionado.id}
                </h3>
                <span className="text-xs text-slate-400">Logo.dev carrega a 1ª palavra da marca</span>
              </div>
              <LogoMarca nome={itemSelecionado.nome} tamanho="md" />
            </div>

            <form onSubmit={salvarAlteracoesIndividual} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Nome (Ex: <em>Nestle Leite Ninho</em>, <em>Sadia Presunto</em>)
                </label>
                <input
                  type="text"
                  required
                  value={itemSelecionado.nome}
                  onChange={(e) =>
                    setItemSelecionado({ ...itemSelecionado, nome: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Data Início</label>
                  <input
                    type="date"
                    required
                    value={itemSelecionado.dataIni}
                    onChange={(e) =>
                      setItemSelecionado({ ...itemSelecionado, dataIni: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Data Validade</label>
                  <input
                    type="date"
                    required
                    value={itemSelecionado.dataVal}
                    onChange={(e) =>
                      setItemSelecionado({ ...itemSelecionado, dataVal: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={itemSelecionado.preco}
                  onChange={(e) =>
                    setItemSelecionado({
                      ...itemSelecionado,
                      preco: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setItemSelecionado(null)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edição em Lote */}
      {modalLoteAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border-t-4 border-indigo-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-800">Editar Múltiplos Itens em Lote</h3>
              <LogoMarca nome={formLote.nome} tamanho="md" />
            </div>
            <p className="text-xs text-slate-500 mb-4">
              A 1ª palavra do nome atualizará a marca/logo de todos os itens do intervalo.
            </p>

            <form onSubmit={salvarEdicaoEmLote} className="space-y-4">
              <div className="bg-indigo-50/70 p-3.5 rounded-lg border border-indigo-100">
                <label className="block text-xs font-bold text-indigo-900 mb-2">
                  Intervalo de IDs (1 a {TOTAL_ITENS})
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Do ID:</label>
                    <input
                      type="number"
                      min={1}
                      max={TOTAL_ITENS}
                      required
                      value={formLote.idInicio}
                      onChange={(e) =>
                        setFormLote({ ...formLote, idInicio: parseInt(e.target.value) || 1 })
                      }
                      className="w-full bg-white border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Até o ID:</label>
                    <input
                      type="number"
                      min={1}
                      max={TOTAL_ITENS}
                      required
                      value={formLote.idFim}
                      onChange={(e) =>
                        setFormLote({ ...formLote, idFim: parseInt(e.target.value) || 1 })
                      }
                      className="w-full bg-white border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Nome (Ex: <em>Danone Iogurte Grego</em>)
                </label>
                <input
                  type="text"
                  required
                  value={formLote.nome}
                  onChange={(e) => setFormLote({ ...formLote, nome: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Data Início</label>
                  <input
                    type="date"
                    required
                    value={formLote.dataIni}
                    onChange={(e) => setFormLote({ ...formLote, dataIni: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Data Validade</label>
                  <input
                    type="date"
                    required
                    value={formLote.dataVal}
                    onChange={(e) => setFormLote({ ...formLote, dataVal: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formLote.preco}
                  onChange={(e) =>
                    setFormLote({ ...formLote, preco: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setModalLoteAberto(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                >
                  Aplicar aos IDs ({Math.min(formLote.idInicio, formLote.idFim)} até {Math.max(formLote.idInicio, formLote.idFim)})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardRetangulos;