# Floricultura Encantada 🌸

Um site SPA moderno e elegante para venda de buquês, desenvolvido com Next.js 14, TypeScript e CSS Modules.

## Funcionalidades

- **Design Premium**: Tema "Dark Floral" com cores vibrantes e elegantes.
- **Efeitos Visuais**: Pétalas caindo com animação CSS e efeito de profundidade (parallax).
- **Cards Flutuantes**: Efeito de vidro (Glassmorphism) com hover interativo.
- **Responsividade**: Layout adaptável para Celulares, Tablets, Desktop e Ultrawide.
- **Sidebar Interativa**: Filtros de cor, tipo e preço (funcionalidade básica implementada).

## Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: CSS Modules & Variáveis CSS (Sem Tailwind, conforme preferências de performance e controle)
- **Fontes**: Outfit e Playfair Display (Otimizadas via Next/Font)

## Como Rodar

1. Instale as dependências:
```bash
npm install
```

2. Rode o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse `http://localhost:3000` no seu navegador.

## Estrutura do Projeto

- `src/app/page.tsx`: Página principal (SPA) com lógica de filtragem.
- `src/components/Petals`: Componente de fundo animado.
- `src/components/Sidebar`: Barra lateral de filtros.
- `src/components/Card`: Componente de exibição do buquê.
- `src/app/globals.css`: Variáveis globais de estilo e tema.
