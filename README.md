# Carrossel

Projeto estático inicial servido via Vite para desenvolvimento rápido.

## Pré-requisitos
- Node.js (versão 18+ recomendada)
- npm

## Instalação
```bash
npm install
```

## Desenvolvimento
```bash
npm run dev
```
Abra o endereço mostrado no terminal (geralmente http://localhost:5173).

## Build de produção
```bash
npm run build
npm run preview
```

## Observações
O arquivo `index.html` ainda usa React via CDN e Babel Standalone dentro de `<script type="text/babel">`. Isso funciona, mas para aproveitar totalmente o Vite você pode migrar esse código para `src/main.jsx` e instalar dependências reais:
```bash
npm install react react-dom
```
Depois substituir os CDNs por:
```html
<script type="module" src="/src/main.jsx"></script>
```

## Próximos Passos (Opcional)
- Migrar JSX inline para módulo.
- Adicionar lógica de carrossel em arquivos separados.
- Configurar Tailwind local (em vez de CDN) se quiser customização avançada.
