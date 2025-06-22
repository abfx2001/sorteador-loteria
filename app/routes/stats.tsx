import type { Route } from "./+types/stats";
import { useState, useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Estatísticas - Gerador de Números" },
    { name: "description", content: "Visualize suas estatísticas de sorteios!" },
  ];
}

interface GameStat {
  gameName: string;
  totalGames: number;
  totalCost: number;
  mostFrequentNumbers: { number: number; frequency: number }[];
  lastGenerated: string;
  allGeneratedGames?: number[][];
}

// Função para formatar estatísticas como texto
function formatStatsAsText(stat: GameStat): string {
  const lines = [];
  
  // Cabeçalho
  lines.push('📊 ESTATÍSTICAS DE SORTEIO');
  lines.push('═'.repeat(50));
  lines.push(`🎯 Configuração: ${stat.gameName}`);
  lines.push(`📅 Última geração: ${stat.lastGenerated}`);
  lines.push(`🎲 Total de jogos: ${stat.totalGames}`);
  lines.push('═'.repeat(50));
  lines.push('');
  
  // Números mais frequentes
  lines.push('🔢 NÚMEROS MAIS FREQUENTES:');
  lines.push('-'.repeat(30));
  stat.mostFrequentNumbers.slice(0, 10).forEach((item, index) => {
    const bar = '█'.repeat(Math.ceil((item.frequency / stat.mostFrequentNumbers[0].frequency) * 10));
    lines.push(`${(index + 1).toString().padStart(2, '0')}. Número ${item.number.toString().padStart(2, '0')}: ${item.frequency} vezes ${bar}`)
  });
  
  lines.push('');
  
  // Jogos históricos se existirem
  if (stat.allGeneratedGames && stat.allGeneratedGames.length > 0) {
    lines.push('🎲 JOGOS GERADOS RECENTEMENTE:');
    lines.push('-'.repeat(35));
    stat.allGeneratedGames.slice(-20).forEach((game, index) => {
      const numbersText = game.map(num => num.toString().padStart(2, '0')).join(' - ');
      lines.push(`Jogo ${(index + 1).toString().padStart(2, '0')}: ${numbersText}`);
    });
    
    if (stat.allGeneratedGames.length > 20) {
      lines.push(`... e mais ${stat.allGeneratedGames.length - 20} jogos anteriores`);
    }
    lines.push('');
  }
  
  lines.push('═'.repeat(50));
  lines.push('📈 Relatório gerado automaticamente');
  lines.push(`⏰ ${new Date().toLocaleString('pt-BR')}`);
  
  return lines.join('\n');
}

export default function Stats() {
  const [stats, setStats] = useState<GameStat[]>([]);
  const [copySuccess, setCopySuccess] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const savedStats = localStorage.getItem('lottery-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const clearStats = () => {
    if (confirm('Tem certeza que deseja limpar todas as estatísticas?')) {
      localStorage.removeItem('lottery-stats');
      setStats([]);
    }
  };

  const copyStatAsText = async (stat: GameStat, index: number) => {
    const textToCopy = formatStatsAsText(stat);
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(prev => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopySuccess(prev => ({ ...prev, [index]: false }));
      }, 3000);
    } catch (err) {
      // Fallback para navegadores sem suporte ao clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(prev => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopySuccess(prev => ({ ...prev, [index]: false }));
      }, 3000);
    }
  };

  if (stats.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              📊 Estatísticas dos Sorteios
            </h1>
            <p className="text-gray-600">
              Acompanhe o histórico e frequência dos seus números
            </p>
            <div className="mt-4">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔙 Voltar ao Gerador
              </a>
            </div>
          </header>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Nenhuma estatística encontrada
            </h2>
            <p className="text-gray-600 mb-6">
              Gere alguns números primeiro para ver suas estatísticas aqui!
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              🎲 Gerar Primeiro Sorteio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Estatísticas dos Sorteios
          </h1>
          <p className="text-gray-600">
            Histórico completo dos seus números gerados
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔙 Voltar ao Gerador
            </a>
            <button
              onClick={clearStats}
              className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              🗑️ Limpar Estatísticas
            </button>
          </div>
        </header>

        <div className="grid gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    🎯 {stat.gameName}
                  </h2>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📅 Última geração: {stat.lastGenerated}</p>
                    <p>🎲 Total de jogos: <strong>{stat.totalGames}</strong></p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyStatAsText(stat, index)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
                      copySuccess[index]
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {copySuccess[index] ? '✅ Copiado!' : '📋 Copiar'}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-4">🔢 Números Mais Frequentes:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {stat.mostFrequentNumbers.slice(0, 20).map((item, numIndex) => (
                    <div
                      key={numIndex}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-gray-200"
                    >
                      <div className="text-center">
                        <div className="font-bold text-lg text-gray-800">
                          {item.number.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-gray-600">
                          {item.frequency} vez{item.frequency > 1 ? 'es' : ''}
                        </div>
                        <div className="mt-1">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              style={{
                                width: `${(item.frequency / stat.mostFrequentNumbers[0].frequency) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {stat.mostFrequentNumbers.length > 20 && (
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    ... e mais {stat.mostFrequentNumbers.length - 20} números únicos
                  </p>
                )}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-700">
                  <p>
                    <strong>📈 Resumo:</strong> Total de {stat.totalGames} jogos gerados 
                    com {stat.mostFrequentNumbers.length} números únicos diferentes.
                  </p>
                  {stat.mostFrequentNumbers.length > 0 && (
                    <p className="mt-1">
                      🏆 Número mais frequente: <strong>{stat.mostFrequentNumbers[0].number}</strong> ({stat.mostFrequentNumbers[0].frequency} vezes)
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>
            📊 Estatísticas salvas localmente no seu navegador. 
            Use as informações para analisar padrões nos seus jogos!
          </p>
        </footer>
      </div>
    </div>
  );
} 