/*
 * Gerador de Números para Sorteios
 * Copyright (c) 2024 Arthur Batista Furlan
 * 
 * Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * https://creativecommons.org/licenses/by-nc-sa/4.0/
 * 
 * For commercial use, contact: arthurbfx2001@gmail.com
 */

import type { Route } from "./+types/home";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gerador de Números - Sorteios" },
    { name: "description", content: "Gere números aleatórios para qualquer tipo de sorteio!" },
  ];
}

function generateRandomNumbers(count: number, min: number, max: number, excludeNumbers: Set<number> = new Set()): number[] {
  const numbers = new Set<number>();
  const availableNumbers = [];
  
  // Criar lista de números disponíveis (excluindo os que devem ser evitados)
  for (let i = min; i <= max; i++) {
    if (!excludeNumbers.has(i)) {
      availableNumbers.push(i);
    }
  }
  
  // Se não há números suficientes disponíveis, usar todos os números possíveis
  if (availableNumbers.length < count) {
    while (numbers.size < count && numbers.size < (max - min + 1)) {
      numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
  } else {
    // Gerar números aleatórios da lista disponível
    while (numbers.size < count && availableNumbers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const selectedNumber = availableNumbers.splice(randomIndex, 1)[0];
      numbers.add(selectedNumber);
    }
  }
  
  return Array.from(numbers).sort((a, b) => a - b);
}

function generateUniqueGames(numberOfGames: number, numbersPerGame: number, min: number, max: number, maximizeUnique: boolean, fixedNumbers: number[]): number[][] {
  const totalNumbers = max - min + 1;
  const validFixedNumbers = fixedNumbers.filter(num => num >= min && num <= max);
  const remainingNumbersPerGame = numbersPerGame - validFixedNumbers.length;
  
  if (remainingNumbersPerGame <= 0) {
    // Se os números fixos já preenchem ou excedem o que é necessário
    const games: number[][] = [];
    for (let i = 0; i < numberOfGames; i++) {
      games.push([...validFixedNumbers].sort((a, b) => a - b));
    }
    return games;
  }
  
  const maxUniqueGames = maximizeUnique ? Math.floor((totalNumbers - validFixedNumbers.length) / remainingNumbersPerGame) : numberOfGames;
  
  if (!maximizeUnique) {
    // Geração normal - cada jogo é independente
    const games: number[][] = [];
    const fixedSet = new Set(validFixedNumbers);
    
    for (let i = 0; i < numberOfGames; i++) {
      const randomNumbers = generateRandomNumbers(remainingNumbersPerGame, min, max, fixedSet);
      const gameNumbers = [...validFixedNumbers, ...randomNumbers].sort((a, b) => a - b);
      games.push(gameNumbers);
    }
    return games;
  }
  
  // Geração com maximização de jogos únicos
  const games: number[][] = [];
  const usedNumbers = new Set(validFixedNumbers); // Começar com números fixos já marcados como usados
  
  // Primeira fase: gerar jogos únicos (sem repetição de números entre jogos)
  const uniqueGamesToGenerate = Math.min(numberOfGames, maxUniqueGames);
  
  for (let gameIndex = 0; gameIndex < uniqueGamesToGenerate; gameIndex++) {
    const availableNumbers = [];
    for (let num = min; num <= max; num++) {
      if (!usedNumbers.has(num)) {
        availableNumbers.push(num);
      }
    }
    
    // Selecionar números aleatoriamente dos disponíveis
    const gameNumbers: number[] = [...validFixedNumbers]; // Começar com números fixos
    for (let i = 0; i < remainingNumbersPerGame && availableNumbers.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const selectedNumber = availableNumbers.splice(randomIndex, 1)[0];
      gameNumbers.push(selectedNumber);
      usedNumbers.add(selectedNumber);
    }
    
    games.push(gameNumbers.sort((a, b) => a - b));
  }
  
  // Segunda fase: se ainda precisamos de mais jogos, gerar com possível repetição
  const fixedSet = new Set(validFixedNumbers);
  for (let gameIndex = uniqueGamesToGenerate; gameIndex < numberOfGames; gameIndex++) {
    const randomNumbers = generateRandomNumbers(remainingNumbersPerGame, min, max, fixedSet);
    const gameNumbers = [...validFixedNumbers, ...randomNumbers].sort((a, b) => a - b);
    games.push(gameNumbers);
  }
  
  return games;
}

function saveGameStats(minNumber: number, maxNumber: number, numbersPerGame: number, numberOfGames: number, allNumbers: number[], maximizeUnique: boolean, hasFixedNumbers: boolean) {
  const gameConfig = `${minNumber}-${maxNumber} (${numbersPerGame} números)${maximizeUnique ? ' - Únicos' : ''}${hasFixedNumbers ? ' - Fixos' : ''}`;
  const existingStats = JSON.parse(localStorage.getItem('lottery-stats') || '[]');
  
  // Encontrar estatísticas existentes para esta configuração
  const gameIndex = existingStats.findIndex((stat: any) => stat.gameName === gameConfig);
  
  // Contar frequência dos números
  const numberFrequency: { [key: number]: number } = {};
  allNumbers.forEach(num => {
    numberFrequency[num] = (numberFrequency[num] || 0) + 1;
  });
  
  const frequencyArray = Object.entries(numberFrequency).map(([num, freq]) => ({
    number: parseInt(num),
    frequency: freq as number
  })).sort((a, b) => b.frequency - a.frequency);
  
  if (gameIndex >= 0) {
    // Atualizar estatísticas existentes
    existingStats[gameIndex].totalGames += numberOfGames;
    existingStats[gameIndex].lastGenerated = new Date().toLocaleString('pt-BR');
    
    // Combinar frequências de números
    const existingFreq = existingStats[gameIndex].mostFrequentNumbers;
    const combinedFreq: { [key: number]: number } = {};
    
    existingFreq.forEach((item: any) => {
      combinedFreq[item.number] = item.frequency;
    });
    
    frequencyArray.forEach(item => {
      combinedFreq[item.number] = (combinedFreq[item.number] || 0) + item.frequency;
    });
    
    existingStats[gameIndex].mostFrequentNumbers = Object.entries(combinedFreq)
      .map(([num, freq]) => ({ number: parseInt(num), frequency: freq as number }))
      .sort((a, b) => b.frequency - a.frequency);
  } else {
    // Criar nova entrada
    existingStats.push({
      gameName: gameConfig,
      totalGames: numberOfGames,
      totalCost: 0, // Sem custo definido
      mostFrequentNumbers: frequencyArray,
      lastGenerated: new Date().toLocaleString('pt-BR')
    });
  }
  
  localStorage.setItem('lottery-stats', JSON.stringify(existingStats));
}

// Função para validar se é um número inteiro
function isValidInteger(value: string): boolean {
  if (value === '') return false;
  const num = parseInt(value);
  return !isNaN(num) && num.toString() === value && num >= 0;
}

// Função para obter classe CSS baseada na validação
function getInputClass(value: string, isValid: boolean): string {
  const baseClass = "w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 transition-colors";
  
  if (value === '') {
    return `${baseClass} border-gray-300 focus:ring-blue-500`;
  }
  
  if (isValid) {
    return `${baseClass} border-green-300 focus:ring-green-500 bg-green-50`;
  } else {
    return `${baseClass} border-red-300 focus:ring-red-500 bg-red-50`;
  }
}

// Função para formatar jogos como texto
function formatGamesAsText(games: number[][], config: {
  minNumber: number;
  maxNumber: number;
  numbersPerGame: number;
  numberOfGames: number;
  maximizeUnique: boolean;
  useFixedNumbers: boolean;
  fixedNumbers: number[];
}): string {
  const timestamp = new Date().toLocaleString('pt-BR');
  const lines = [];
  
  // Cabeçalho
  lines.push('🎲 NÚMEROS GERADOS - SORTEIO');
  lines.push('═'.repeat(40));
  lines.push(`📅 Data/Hora: ${timestamp}`);
  lines.push(`🔢 Intervalo: ${config.minNumber} a ${config.maxNumber}`);
  lines.push(`🎯 ${config.numberOfGames} jogo${config.numberOfGames > 1 ? 's' : ''} com ${config.numbersPerGame} números cada`);
  
  if (config.maximizeUnique) {
    lines.push('⭐ Modo: Jogos únicos maximizados');
  }
  
  if (config.useFixedNumbers && config.fixedNumbers.length > 0) {
    lines.push(`📌 Números fixos: ${config.fixedNumbers.sort((a, b) => a - b).join(', ')}`);
  }
  
  lines.push('═'.repeat(40));
  lines.push('');
  
  // Jogos
  games.forEach((game, index) => {
    const numbersText = game.map(num => num.toString().padStart(2, '0')).join(' - ');
    lines.push(`Jogo ${(index + 1).toString().padStart(2, '0')}: ${numbersText}`);
  });
  
  lines.push('');
  lines.push('═'.repeat(40));
  lines.push('🍀 Boa sorte nos sorteios!');
  
  return lines.join('\n');
}

export default function Home() {
  const [minNumberStr, setMinNumberStr] = useState<string>("1");
  const [maxNumberStr, setMaxNumberStr] = useState<string>("60");
  const [numberOfGamesStr, setNumberOfGamesStr] = useState<string>("1");
  const [numbersPerGameStr, setNumbersPerGameStr] = useState<string>("6");
  const [maximizeUnique, setMaximizeUnique] = useState<boolean>(false);
  const [useFixedNumbers, setUseFixedNumbers] = useState<boolean>(false);
  const [fixedNumbersStr, setFixedNumbersStr] = useState<string[]>([]);
  const [generatedGames, setGeneratedGames] = useState<number[][]>([]);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Validações
  const isMinNumberValid = isValidInteger(minNumberStr);
  const isMaxNumberValid = isValidInteger(maxNumberStr);
  const isNumberOfGamesValid = isValidInteger(numberOfGamesStr) && parseInt(numberOfGamesStr) > 0;
  const isNumbersPerGameValid = isValidInteger(numbersPerGameStr) && parseInt(numbersPerGameStr) > 0;

  // Conversões para números
  const minNumber = isMinNumberValid ? parseInt(minNumberStr) : 0;
  const maxNumber = isMaxNumberValid ? parseInt(maxNumberStr) : 0;
  const numberOfGames = isNumberOfGamesValid ? parseInt(numberOfGamesStr) : 0;
  const numbersPerGame = isNumbersPerGameValid ? parseInt(numbersPerGameStr) : 0;

  // Validação adicional de lógica
  const isRangeValid = minNumber < maxNumber;
  const isCountValid = numbersPerGame <= (maxNumber - minNumber + 1);

  // Ajustar array de números fixos quando necessário
  if (useFixedNumbers && fixedNumbersStr.length !== numbersPerGame) {
    setFixedNumbersStr(new Array(numbersPerGame).fill(''));
  }

  // Validar números fixos
  const fixedNumbers: number[] = [];
  const fixedNumbersValid: boolean[] = [];
  if (useFixedNumbers) {
    fixedNumbersStr.forEach((numStr, index) => {
      if (numStr === '') {
        fixedNumbersValid[index] = true; // Campo vazio é válido
      } else if (isValidInteger(numStr)) {
        const num = parseInt(numStr);
        if (num >= minNumber && num <= maxNumber) {
          fixedNumbers.push(num);
          fixedNumbersValid[index] = true;
        } else {
          fixedNumbersValid[index] = false;
        }
      } else {
        fixedNumbersValid[index] = false;
      }
    });
  }

  // Verificar se há números fixos duplicados
  const uniqueFixedNumbers = new Set(fixedNumbers);
  const hasDuplicateFixed = fixedNumbers.length !== uniqueFixedNumbers.size;
  const allFixedNumbersValid = !useFixedNumbers || (fixedNumbersValid.every(v => v) && !hasDuplicateFixed);

  // Cálculos para jogos únicos
  const totalNumbers = isRangeValid ? maxNumber - minNumber + 1 : 0;
  const availableNumbersForRandom = totalNumbers - fixedNumbers.length;
  const remainingNumbersPerGame = numbersPerGame - fixedNumbers.length;
  const maxUniqueGames = remainingNumbersPerGame > 0 ? Math.floor(availableNumbersForRandom / remainingNumbersPerGame) : numberOfGames;
  const willHaveRepeatedNumbers = maximizeUnique && numberOfGames > maxUniqueGames;

  const generateGames = () => {
    // Validações
    if (!isMinNumberValid) {
      alert('Por favor, insira um número inteiro válido para o número inicial!');
      return;
    }

    if (!isMaxNumberValid) {
      alert('Por favor, insira um número inteiro válido para o número final!');
      return;
    }

    if (!isNumberOfGamesValid) {
      alert('Por favor, insira um número inteiro válido maior que zero para a quantidade de jogos!');
      return;
    }

    if (!isNumbersPerGameValid) {
      alert('Por favor, insira um número inteiro válido maior que zero para números por jogo!');
      return;
    }

    if (!isRangeValid) {
      alert('O número inicial deve ser menor que o número final!');
      return;
    }

    if (!isCountValid) {
      alert(`Não é possível gerar ${numbersPerGame} números únicos no intervalo de ${minNumber} a ${maxNumber}!`);
      return;
    }

    if (!allFixedNumbersValid) {
      alert('Por favor, corrija os números fixos! Verifique se estão no intervalo correto e não há duplicatas.');
      return;
    }

    if (fixedNumbers.length >= numbersPerGame) {
      alert('Os números fixos já preenchem todos os números por jogo! Reduza a quantidade de números fixos ou aumente os números por jogo.');
      return;
    }

    const games = generateUniqueGames(numberOfGames, numbersPerGame, minNumber, maxNumber, maximizeUnique, fixedNumbers);
    const allNumbers: number[] = games.flat();
    
    setGeneratedGames(games);
    setCopySuccess(false); // Reset copy success state
    
    // Salvar estatísticas
    saveGameStats(minNumber, maxNumber, numbersPerGame, numberOfGames, allNumbers, maximizeUnique, useFixedNumbers && fixedNumbers.length > 0);
  };

  const clearGames = () => {
    setGeneratedGames([]);
    setCopySuccess(false);
  };

  const copyGamesAsText = async () => {
    if (generatedGames.length === 0) return;
    
    const config = {
      minNumber,
      maxNumber,
      numbersPerGame,
      numberOfGames,
      maximizeUnique,
      useFixedNumbers: useFixedNumbers && fixedNumbers.length > 0,
      fixedNumbers
    };
    
    const textToCopy = formatGamesAsText(generatedGames, config);
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      // Fallback para navegadores sem suporte ao clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  // Verificar se todos os campos são válidos para habilitar o botão
  const allFieldsValid = isMinNumberValid && isMaxNumberValid && isNumberOfGamesValid && isNumbersPerGameValid && isRangeValid && isCountValid && allFixedNumbersValid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎲 Gerador de Números Aleatórios
          </h1>
          <p className="text-gray-600">
            Configure e gere números para qualquer tipo de sorteio
          </p>
          <div className="mt-4">
            <a
              href="/stats"
              className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              📊 Ver Estatísticas
            </a>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⚙️ Configurações do Sorteio</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número inicial:
              </label>
              <input
                type="text"
                value={minNumberStr}
                onChange={(e) => setMinNumberStr(e.target.value)}
                className={getInputClass(minNumberStr, isMinNumberValid)}
                placeholder="Ex: 1"
              />
              {minNumberStr !== '' && !isMinNumberValid && (
                <p className="text-xs text-red-600 mt-1">⚠️ Digite apenas números inteiros</p>
              )}
              {minNumberStr !== '' && isMinNumberValid && (
                <p className="text-xs text-green-600 mt-1">✅ Número válido</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número final:
              </label>
              <input
                type="text"
                value={maxNumberStr}
                onChange={(e) => setMaxNumberStr(e.target.value)}
                className={getInputClass(maxNumberStr, isMaxNumberValid)}
                placeholder="Ex: 60"
              />
              {maxNumberStr !== '' && !isMaxNumberValid && (
                <p className="text-xs text-red-600 mt-1">⚠️ Digite apenas números inteiros</p>
              )}
              {maxNumberStr !== '' && isMaxNumberValid && !isRangeValid && isMinNumberValid && (
                <p className="text-xs text-red-600 mt-1">⚠️ Deve ser maior que o número inicial</p>
              )}
              {maxNumberStr !== '' && isMaxNumberValid && isRangeValid && isMinNumberValid && (
                <p className="text-xs text-green-600 mt-1">✅ Intervalo válido</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade de jogos:
              </label>
              <input
                type="text"
                value={numberOfGamesStr}
                onChange={(e) => setNumberOfGamesStr(e.target.value)}
                className={getInputClass(numberOfGamesStr, isNumberOfGamesValid)}
                placeholder="Ex: 5"
              />
              {numberOfGamesStr !== '' && !isNumberOfGamesValid && (
                <p className="text-xs text-red-600 mt-1">⚠️ Digite um número inteiro maior que zero</p>
              )}
              {numberOfGamesStr !== '' && isNumberOfGamesValid && (
                <p className="text-xs text-green-600 mt-1">✅ Quantidade válida</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Números por jogo:
              </label>
              <input
                type="text"
                value={numbersPerGameStr}
                onChange={(e) => setNumbersPerGameStr(e.target.value)}
                className={getInputClass(numbersPerGameStr, isNumbersPerGameValid)}
                placeholder="Ex: 6"
              />
              {numbersPerGameStr !== '' && !isNumbersPerGameValid && (
                <p className="text-xs text-red-600 mt-1">⚠️ Digite um número inteiro maior que zero</p>
              )}
              {numbersPerGameStr !== '' && isNumbersPerGameValid && !isCountValid && isRangeValid && (
                <p className="text-xs text-red-600 mt-1">⚠️ Muitos números para o intervalo disponível</p>
              )}
              {numbersPerGameStr !== '' && isNumbersPerGameValid && isCountValid && isRangeValid && (
                <p className="text-xs text-green-600 mt-1">✅ Quantidade válida para o intervalo</p>
              )}
            </div>
          </div>

          {/* Opção para maximizar jogos únicos */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="maximizeUnique"
                checked={maximizeUnique}
                onChange={(e) => setMaximizeUnique(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <label htmlFor="maximizeUnique" className="text-sm font-medium text-gray-800 cursor-pointer">
                  🎯 Maximizar jogos únicos
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  Quando ativado, o sistema tentará gerar o máximo de jogos onde nenhum número se repete entre jogos diferentes.
                </p>
                
                {maximizeUnique && allFieldsValid && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
                    <p className="text-blue-800">
                      <strong>📊 Análise de jogos únicos:</strong>
                    </p>
                    <p className="text-blue-700">
                      • Máximo de jogos únicos possíveis: <strong>{maxUniqueGames}</strong>
                    </p>
                    <p className="text-blue-700">
                      • Jogos solicitados: <strong>{numberOfGames}</strong>
                    </p>
                    {willHaveRepeatedNumbers ? (
                      <p className="text-orange-700 mt-1">
                        ⚠️ <strong>{maxUniqueGames}</strong> jogos serão únicos, <strong>{numberOfGames - maxUniqueGames}</strong> jogos poderão ter números repetidos
                      </p>
                    ) : (
                      <p className="text-green-700 mt-1">
                        ✅ Todos os <strong>{numberOfGames}</strong> jogos serão únicos (sem repetição de números entre jogos)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Opção para números fixos */}
          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="useFixedNumbers"
                checked={useFixedNumbers}
                onChange={(e) => setUseFixedNumbers(e.target.checked)}
                className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <label htmlFor="useFixedNumbers" className="text-sm font-medium text-gray-800 cursor-pointer">
                  🔢 Usar números fixos
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  Defina números que aparecerão em todos os jogos. Deixe campos vazios para posições aleatórias.
                </p>
                
                {useFixedNumbers && isNumbersPerGameValid && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Configure os números fixos (deixe vazio para posição aleatória):
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {Array.from({ length: numbersPerGame }, (_, index) => (
                        <div key={index}>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Posição {index + 1}:
                          </label>
                          <input
                            type="text"
                            value={fixedNumbersStr[index] || ''}
                            onChange={(e) => {
                              const newFixedNumbers = [...fixedNumbersStr];
                              newFixedNumbers[index] = e.target.value;
                              setFixedNumbersStr(newFixedNumbers);
                            }}
                            className={`w-full p-2 text-sm border rounded focus:ring-2 focus:border-transparent transition-colors ${
                              !fixedNumbersStr[index] 
                                ? 'border-gray-300 focus:ring-blue-500'
                                : fixedNumbersValid[index] 
                                  ? 'border-green-300 focus:ring-green-500 bg-green-50'
                                  : 'border-red-300 focus:ring-red-500 bg-red-50'
                            }`}
                            placeholder="Vazio"
                          />
                          {fixedNumbersStr[index] && !fixedNumbersValid[index] && (
                            <p className="text-xs text-red-600 mt-1">⚠️ Inválido</p>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {hasDuplicateFixed && (
                      <p className="text-xs text-red-600 mt-3">⚠️ Há números fixos duplicados!</p>
                    )}
                    
                    {fixedNumbers.length > 0 && (
                      <div className="mt-3 p-3 bg-purple-100 border border-purple-200 rounded text-xs">
                        <p className="text-purple-800">
                          <strong>🔢 Números fixos definidos:</strong> {fixedNumbers.sort((a, b) => a - b).join(', ')}
                        </p>
                        <p className="text-purple-700">
                          • Números fixos: <strong>{fixedNumbers.length}</strong>
                        </p>
                        <p className="text-purple-700">
                          • Números aleatórios por jogo: <strong>{numbersPerGame - fixedNumbers.length}</strong>
                        </p>
                        {maximizeUnique && (
                          <p className="text-purple-700">
                            • Máximo de jogos únicos com números fixos: <strong>{maxUniqueGames}</strong>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {allFieldsValid && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                <p><strong>📋 Resumo da configuração:</strong></p>
                <p>• Números de <strong>{minNumber}</strong> até <strong>{maxNumber}</strong></p>
                <p>• <strong>{numberOfGames}</strong> jogo{numberOfGames > 1 ? 's' : ''} com <strong>{numbersPerGame}</strong> números cada</p>
                <p>• Total de números possíveis: <strong>{maxNumber - minNumber + 1}</strong></p>
                {maximizeUnique && (
                  <p>• Modo: <strong>Jogos únicos maximizados</strong></p>
                )}
                {useFixedNumbers && fixedNumbers.length > 0 && (
                  <p>• Números fixos: <strong>{fixedNumbers.sort((a, b) => a - b).join(', ')}</strong></p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={generateGames}
              disabled={!allFieldsValid}
              className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${
                allFieldsValid 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transform hover:scale-105' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              🎯 Gerar Números
            </button>
            
            {generatedGames.length > 0 && (
              <button
                onClick={clearGames}
                className="bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
              >
                🗑️ Limpar
              </button>
            )}
          </div>
        </div>

        {generatedGames.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                🎊 Seus Números Gerados {maximizeUnique && '(Únicos Maximizados)'} {useFixedNumbers && fixedNumbers.length > 0 && '(Com Números Fixos)'}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyGamesAsText}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    copySuccess
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {copySuccess ? '✅ Copiado!' : '📋 Copiar Texto'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  🖨️ Imprimir
                </button>
              </div>
            </div>
            
            <div className="grid gap-4">
              {generatedGames.map((game, index) => {
                const isUniqueGame = maximizeUnique && index < maxUniqueGames;
                return (
                  <div key={index} className={`p-4 rounded-lg ${
                    isUniqueGame 
                      ? 'bg-gradient-to-r from-green-100 to-blue-100 border-l-4 border-green-500' 
                      : 'bg-gradient-to-r from-blue-100 to-purple-100'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700">
                        Jogo {index + 1} {isUniqueGame && '🌟'}
                      </h3>
                      <div className="text-sm text-gray-500">
                        <span>{game.length} números</span>
                        {maximizeUnique && (
                          <span className="ml-2">
                            {isUniqueGame ? '(Único)' : '(Pode repetir)'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {game.map((number) => {
                        const isFixedNumber = fixedNumbers.includes(number);
                        return (
                          <span
                            key={number}
                            className={`font-bold px-3 py-2 rounded-full border-2 min-w-[3rem] text-center shadow-sm ${
                              isFixedNumber 
                                ? 'bg-purple-500 text-white border-purple-600' 
                                : 'bg-white text-gray-800 border-gray-200'
                            }`}
                          >
                            {number.toString().padStart(2, '0')} {isFixedNumber && '📌'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>✅ Sucesso!</strong> {numberOfGames} jogo{numberOfGames > 1 ? 's' : ''} gerado{numberOfGames > 1 ? 's' : ''} com números de {minNumber} a {maxNumber}. 
                {maximizeUnique && willHaveRepeatedNumbers && (
                  <span className="block mt-1">
                    🌟 <strong>{maxUniqueGames}</strong> jogos únicos + <strong>{numberOfGames - maxUniqueGames}</strong> jogos com possível repetição.
                  </span>
                )}
                {maximizeUnique && !willHaveRepeatedNumbers && (
                  <span className="block mt-1">
                    🌟 Todos os jogos são únicos - nenhum número se repete entre jogos!
                  </span>
                )}
                {useFixedNumbers && fixedNumbers.length > 0 && (
                  <span className="block mt-1">
                    📌 <strong>{fixedNumbers.length}</strong> números fixos em todos os jogos: {fixedNumbers.sort((a, b) => a - b).join(', ')}
                  </span>
                )}
                Use o botão "Copiar Texto" para enviar os números ou "Imprimir" para salvar. Suas estatísticas foram salvas automaticamente!
              </p>
            </div>
          </div>
        )}

        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>
            🍀 Gerador flexível para qualquer tipo de sorteio. 
            Configure os números do seu jeito e boa sorte!
          </p>
        </footer>
      </div>

      {/* Botão Flutuante de Apoio */}
      <button
        onClick={() => setShowSupportModal(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50 group"
        title="Apoiar o criador ❤️"
      >
        <div className="flex items-center justify-center">
          <span className="text-2xl">☕</span>
        </div>
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Apoiar o criador ❤️
        </div>
      </button>

      {/* Modal de Apoio */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  ❤️ Apoiar o Criador
                </h3>
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="text-center space-y-4">
                <div className="text-gray-600">
                  <p className="mb-3">
                    ☕ Gostou do gerador de números? 
                  </p>
                  <p className="mb-4 text-sm">
                    Se este aplicativo te ajudou, considere fazer uma contribuição via PIX para apoiar o desenvolvimento e manter o projeto funcionando! 
                  </p>
                </div>

                {/* Container do QR Code */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="w-48 h-48 mx-auto bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src="/qrcode-pix.png"
                      alt="QR Code PIX para apoiar o criador"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback caso a imagem não carregue
                        const target = e.target as HTMLElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="text-center text-gray-500 hidden">
                      <div className="text-6xl mb-2">📱</div>
                      <p className="text-sm">QR Code PIX</p>
                      <p className="text-xs mt-1">Adicione sua imagem QR Code em /public/qrcode-pix.png</p>
                    </div>
                  </div>
                </div>

                {/* Informações PIX */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💳 Informações PIX</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Chave PIX:</strong></p>
                    <p className="bg-white p-2 rounded border font-mono text-xs break-all">
                    00020126450014BR.GOV.BCB.PIX0123arthurbfx2001@gmail.com5204000053039865802BR5921ARTHUR BATISTA FURLAN6009SAO PAULO622605222QgWkZY5TF2KB9U01osal4630483D6
                    </p>
                    <p className="text-xs mt-2">
                      Ou escaneie o QR Code acima com seu app bancário
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 pt-2 border-t">
                  <p>
                    🙏 Qualquer valor é muito bem-vindo e ajuda a manter o projeto ativo. 
                    Obrigado pelo seu apoio!
                  </p>
                </div>

                <button
                  onClick={() => setShowSupportModal(false)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
