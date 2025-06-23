# 🎲 Gerador de Números Aleatórios

Um aplicativo web moderno e flexível para gerar números aleatórios para qualquer tipo de sorteio. Configure seus próprios parâmetros e gere números de forma rápida e organizada, com recursos avançados para maximizar a eficiência dos seus jogos.

![Sorteador](https://img.shields.io/badge/React-Router-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-green)

## 🎯 Funcionalidades

### ⚙️ Configuração Flexível

- **Número inicial** - Defina de onde os números começam (ex: 1, 0, 10...)
- **Número final** - Defina até onde os números vão (ex: 60, 100, 1000...)
- **Quantidade de jogos** - Quantos sorteios você quer gerar (sem limite!)
- **Números por jogo** - Quantos números únicos cada sorteio terá

### ✨ Recursos Principais

#### 🎯 Geração Inteligente

- **Algoritmo otimizado** que garante números únicos por jogo
- **Validação em tempo real** com feedback visual imediato
- **Campos de entrada inteligentes** que só aceitam números inteiros válidos
- **Prevenção de configurações impossíveis** com alertas informativos

#### ⭐ Jogos Únicos Maximizados

- **Modo especial** que maximiza jogos únicos (sem repetição de números entre jogos)
- **Análise automática** mostra quantos jogos únicos são possíveis
- **Algoritmo híbrido** gera primeiro jogos únicos, depois complementa com repetições se necessário
- **Indicação visual** diferencia jogos únicos (⭐ fundo verde) dos com possível repetição

#### 📌 Números Fixos

- **Configure números que aparecerão em todos os jogos**
- **Interface dinâmica** com campos para cada posição do jogo
- **Validação inteligente** impede duplicatas e números fora do intervalo
- **Compatível com jogos únicos** - números fixos não se repetem nas posições aleatórias
- **Destaque visual** - números fixos aparecem com ícone 📌 e fundo roxo

#### 📋 Cópia de Texto Avançada

- **Botão "Copiar Texto"** na página principal para todos os jogos gerados
- **Formato profissional** com cabeçalho, configurações e timestamp
- **Compatível com qualquer aplicativo** - WhatsApp, email, notas, etc.
- **Feedback visual** com confirmação "✅ Copiado!" por 3 segundos
- **Fallback universal** funciona em qualquer navegador

#### 📊 Estatísticas Completas

- **Histórico detalhado** de todas as configurações usadas
- **Números mais frequentes** com gráficos de barras visuais
- **Botão "Copiar"** para gerar relatórios completos das estatísticas
- **Armazenamento automático** no navegador
- **Análise de padrões** por configuração

#### 🎨 Interface Moderna

- **Validação visual em tempo real** - campos verdes (✅) para válidos, vermelhos (⚠️) para inválidos
- **Resumo dinâmico** da configuração com análise de jogos únicos
- **Design responsivo** otimizado para todos os dispositivos
- **Feedback imediato** para todas as ações do usuário
- **Cores e ícones intuitivos** para diferentes tipos de jogos

### 🔍 Validações Inteligentes

#### Validação de Campos

- **Apenas números inteiros** - rejeita decimais, texto misto, números negativos
- **Feedback visual imediato** - verde para válido, vermelho para inválido
- **Mensagens específicas** para cada tipo de erro
- **Prevenção de envio** com campos inválidos

#### Validação de Lógica

- **Intervalo válido** - número inicial menor que final
- **Quantidade possível** - números por jogo não excedem o intervalo
- **Números fixos válidos** - dentro do intervalo e sem duplicatas
- **Configurações impossíveis** bloqueadas com explicações claras

## 🚀 Como Usar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação e Execução

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre no diretório
cd sorteador

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Para build de produção
npm run build
npm start
```

O aplicativo estará disponível em `http://localhost:5173`

## 📋 Guia de Uso Completo

### 1. Configuração Básica

1. **Número inicial**: Digite o primeiro número do intervalo
2. **Número final**: Digite o último número do intervalo
3. **Quantidade de jogos**: Quantos sorteios gerar
4. **Números por jogo**: Quantos números únicos por sorteio

### 2. Recursos Avançados

#### 🎯 Maximizar Jogos Únicos

1. Marque a opção "Maximizar jogos únicos"
2. Veja a análise automática de quantos jogos únicos são possíveis
3. Sistema gera primeiro jogos únicos, depois complementa se necessário
4. Jogos únicos aparecem com ⭐ e fundo verde

#### 📌 Números Fixos

1. Marque a opção "Usar números fixos"
2. Configure números que aparecerão em todos os jogos
3. Deixe campos vazios para posições aleatórias
4. Números fixos aparecem com 📌 e fundo roxo

### 3. Geração e Resultados

1. **Visualize o resumo** - Configuração é validada em tempo real
2. **Gere os números** - Botão só fica ativo com configuração válida
3. **Veja os resultados** - Números organizados por jogo com indicações visuais
4. **Copie ou imprima** - Use os botões para salvar ou compartilhar

### 4. Estatísticas

- Acesse "Ver Estatísticas" para histórico completo
- Veja números mais frequentes por configuração
- Copie relatórios detalhados das estatísticas
- Analise padrões nos seus jogos

## 🎮 Exemplos de Uso

### Mega-Sena Tradicional

```
Número inicial: 1
Número final: 60
Números por jogo: 6
Quantidade: 3 jogos

Resultado:
Jogo 1: 05 - 12 - 23 - 45 - 56 - 60
Jogo 2: 03 - 18 - 27 - 33 - 41 - 57  
Jogo 3: 07 - 14 - 29 - 36 - 48 - 59
```

### Quina com Jogos Únicos

```
Número inicial: 1
Número final: 80
Números por jogo: 5
Quantidade: 10 jogos
✅ Maximizar jogos únicos

Resultado:
⭐ 16 jogos únicos possíveis
✅ Todos os 10 jogos serão únicos
```

### Sorteio com Números Fixos

```
Número inicial: 1
Número final: 60
Números por jogo: 6
Quantidade: 5 jogos
📌 Números fixos: 07, 14

Resultado:
Jogo 1: 📌07 - 📌14 - 23 - 35 - 42 - 58
Jogo 2: 📌07 - 📌14 - 05 - 18 - 29 - 51
(Números 07 e 14 aparecem em todos os jogos)
```

### Formato de Texto Copiado

```
🎲 NÚMEROS GERADOS - SORTEIO
════════════════════════════════════════
📅 Data/Hora: 15/12/2024 14:30:25
🔢 Intervalo: 1 a 60
🎯 5 jogos com 6 números cada
⭐ Modo: Jogos únicos maximizados
📌 Números fixos: 07, 14
════════════════════════════════════════

Jogo 01: 07 - 14 - 23 - 35 - 42 - 58
Jogo 02: 07 - 14 - 05 - 18 - 29 - 51
Jogo 03: 07 - 14 - 12 - 27 - 39 - 54
Jogo 04: 07 - 14 - 08 - 21 - 33 - 47
Jogo 05: 07 - 14 - 16 - 28 - 41 - 59

════════════════════════════════════════
🍀 Boa sorte nos sorteios!
```

## 🛠️ Tecnologias Utilizadas

- **React Router v7** - Framework de roteamento moderno
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS** - Framework CSS utilitário
- **Vite** - Build tool rápido e moderno
- **LocalStorage** - Persistência de dados local
- **Clipboard API** - Cópia de texto moderna com fallback

## 🎲 Algoritmos Avançados

### Validação de Entrada

```typescript
function isValidInteger(value: string): boolean {
  if (value === '') return false;
  const num = parseInt(value);
  return !isNaN(num) && num.toString() === value && num >= 0;
}
```

### Geração de Jogos Únicos

```typescript
// Primeira fase: jogos únicos (sem repetição entre jogos)
// Segunda fase: jogos com possível repetição se necessário
// Integração com números fixos
```

### Algoritmo de Números Fixos

- Reserva números fixos antes da geração aleatória
- Garante que números fixos não se repetem nas posições aleatórias
- Compatível com modo de jogos únicos

### Validações Inteligentes

- ✅ Validação de números inteiros em tempo real
- ✅ Prevenção de configurações impossíveis
- ✅ Feedback visual imediato
- ✅ Análise automática de jogos únicos possíveis

## 📊 Sistema de Estatísticas

### Armazenamento Inteligente

- **Agrupamento por configuração** - estatísticas organizadas por tipo de jogo
- **Incremento automático** - dados são somados a estatísticas existentes
- **Persistência local** - dados salvos no navegador
- **Análise de frequência** - números mais sorteados por configuração

### Relatórios Detalhados

- **Cópia de estatísticas** em formato texto profissional
- **Gráficos de barras** em texto ASCII
- **Histórico de jogos** (últimos 20 jogos por configuração)
- **Análise de padrões** com totalizadores

## 📱 Interface e Experiência

### Validação Visual

- **Campos verdes** ✅ para entradas válidas
- **Campos vermelhos** ⚠️ para entradas inválidas
- **Mensagens específicas** para cada tipo de erro
- **Resumo dinâmico** da configuração

### Indicadores Visuais

- **⭐ Jogos únicos** - fundo verde com estrela
- **📌 Números fixos** - fundo roxo com alfinete
- **Jogos normais** - gradiente azul/roxo
- **Feedback de cópia** - confirmação verde temporária

### Responsividade Completa

- **Mobile First** - otimizado para celulares
- **Tablet Friendly** - interface adaptada para tablets  
- **Desktop Enhanced** - aproveita telas maiores
- **Touch Friendly** - botões adequados para touch

## 🎯 Casos de Uso Específicos

### Para Loterias Oficiais

```
Mega-Sena: 1-60, 6 números
Quina: 1-80, 5 números  
Lotofácil: 1-25, 15 números
Timemania: 1-80, 10 números
```

### Para Sorteios Personalizados

```
Rifas: 1-1000, 1 número
Bingo: 1-75, 24 números
Grupos: 1-30, 5 números
```

### Para Estratégias Avançadas

```
Jogos únicos: Maximizar cobertura de números
Números fixos: Manter números de sorte
Múltiplas configurações: Diferentes estratégias
```

## 🔧 Recursos Técnicos

### Validação Robusta

- **Entrada de texto** com validação de números inteiros
- **Rejeição de decimais** e números negativos
- **Prevenção de texto misto** (ex: "12abc")
- **Feedback visual imediato** para cada campo

### Algoritmos Otimizados

- **Geração eficiente** para qualquer tamanho de intervalo
- **Prevenção de loops infinitos** em configurações impossíveis
- **Ordenação automática** dos resultados
- **Integração perfeita** entre recursos avançados

### Persistência de Dados

- **LocalStorage** para estatísticas e configurações
- **Agrupamento inteligente** por tipo de jogo
- **Incremento de dados** sem perda de histórico
- **Limpeza seletiva** de dados

## 📋 Formato de Exportação

### Texto para Cópia

```
🎲 NÚMEROS GERADOS - SORTEIO
════════════════════════════════════════
📅 Data/Hora: [timestamp]
🔢 Intervalo: [min] a [max]
🎯 [quantidade] jogo(s) com [números] números cada
[⭐ Modo: Jogos únicos maximizados]
[📌 Números fixos: [lista]]
════════════════════════════════════════

Jogo 01: 01 - 05 - 12 - 23 - 35 - 42
Jogo 02: 03 - 08 - 15 - 27 - 38 - 45
...

════════════════════════════════════════
🍀 Boa sorte nos sorteios!
```

### Relatório de Estatísticas

```
📊 ESTATÍSTICAS DE SORTEIO
══════════════════════════════════════════════════
🎯 Configuração: [nome da configuração]
📅 Última geração: [timestamp]
🎲 Total de jogos: [quantidade]
══════════════════════════════════════════════════

🔢 NÚMEROS MAIS FREQUENTES:
------------------------------
01. Número 07: 15 vezes ██████████
02. Número 14: 12 vezes ████████
...

🎲 JOGOS GERADOS RECENTEMENTE:
-----------------------------------
Jogo 01: 07 - 14 - 23 - 35 - 42
...

══════════════════════════════════════════════════
📈 Relatório gerado automaticamente
⏰ [timestamp]
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License** - veja o arquivo [LICENSE](LICENSE) para detalhes completos.

### Resumo da Licença CC BY-NC-SA 4.0

✅ **Permitido (Uso Não-Comercial):**
- ✅ Uso pessoal e educacional
- ✅ Modificação e adaptação
- ✅ Distribuição e compartilhamento
- ✅ Uso em projetos open source

📋 **Condições Obrigatórias:**
- 📝 **Atribuição** - Deve creditar o autor original
- 🔗 **Link da licença** - Deve incluir link para a licença
- 📋 **Indicar mudanças** - Se modificou, deve indicar
- 🔄 **ShareAlike** - Modificações devem usar a mesma licença

❌ **Proibido:**
- 💼 **Uso comercial** sem autorização expressa
- 🏢 **Uso empresarial** para fins lucrativos
- 💰 **Venda ou monetização** sem permissão

### 💼 Uso Comercial

Para uso comercial deste software, incluindo:
- Integração em produtos comerciais
- Uso em ambientes empresariais
- Distribuição como parte de software comercial
- Uso por empresas para fins lucrativos

**É necessário obter autorização expressa por escrito.**

📧 **Contato para licenciamento comercial:** arthurbfx2001@gmail.com

### Copyright

© 2024 Arthur Batista Furlan. Todos os direitos reservados sob a Licença CC BY-NC-SA 4.0.

🔗 **Licença completa:** https://creativecommons.org/licenses/by-nc-sa/4.0/

## 🍀 Flexibilidade Total

### Configurações Possíveis

- **Pequenos**: 1-10 com 3 números
- **Médios**: 1-100 com 20 números  
- **Grandes**: 1-1000 com 50 números
- **Personalizados**: Qualquer intervalo que imaginar!

### Recursos Combinados

- **Jogos únicos + Números fixos** - Máxima eficiência
- **Múltiplas configurações** - Diferentes estratégias
- **Exportação completa** - Compatível com qualquer aplicativo
- **Análise detalhada** - Estatísticas profissionais

---

*Desenvolvido com ❤️ para quem precisa de números aleatórios organizados, inteligentes e confiáveis.*
