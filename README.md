# AgroSync — Frontend

Interface web do AgroSync, plataforma de gestão agrícola. Construída com React 19 + TypeScript + Tailwind CSS.

---

## Stack

| Biblioteca | Versão | Função |
|---|---|---|
| React | 19.0 | Framework de UI |
| TypeScript | 4.9 | Tipagem estática |
| Tailwind CSS | 3.4 | Estilização utility-first |
| React Router DOM | 7.4 | Roteamento SPA |
| Axios | 1.8 | Requisições HTTP |
| Recharts | 2.15 | Gráficos do dashboard |
| FullCalendar | 6.1 | Calendário sazonal |
| Lucide React | 0.503 | Ícones |
| React Toastify | 11.0 | Notificações toast |
| React Markdown | 10.1 | Markdown no chat IA |
| date-fns | 4.1 | Manipulação de datas |

---

## Pré-requisitos

- Node.js 18+
- Backend rodando (ver `../back-agro-sync/README.md`)

---

## Instalação e desenvolvimento

```bash
npm install
npm start
```

O app inicia em `http://localhost:3001` (se a porta 3000 estiver ocupada pelo API Gateway).

### Build de produção

```bash
npm run build
```

Gera a pasta `build/` com os arquivos estáticos otimizados.

---

## Variáveis de Ambiente

Crie `.env` na raiz deste diretório:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

Em produção, aponte para a URL do seu servidor.

---

## Estrutura de Pastas

```
src/
├── components/
│   └── Layout/             ← Shell (sidebar + header)
├── pages/
│   ├── Auth/               ← Login e Registro
│   ├── Dashboard/          ← Hub com KPIs e gráficos
│   ├── Gardens/            ← Canteiros + modais (5 abas)
│   ├── CropPlans/          ← Planos de cultivo
│   ├── SupplyStock/        ← Estoque de insumos
│   ├── TaskManager/        ← Kanban de tarefas
│   ├── TaskAgenda/         ← Agenda do dia
│   ├── SeasonalCalendar/   ← Calendário FullCalendar
│   ├── AskAI/              ← Chat com IA
│   ├── Settings/           ← Perfil e organização
│   ├── AgroSettings/       ← Categorias e unidades
│   └── SearchResults/      ← Busca global
├── service/
│   ├── api.ts              ← Instância Axios + interceptor JWT
│   ├── gardenService.ts
│   ├── supplyService.ts
│   ├── taskService.ts
│   ├── cropPlanService.ts
│   ├── cropCycleService.ts
│   ├── dashboardService.ts
│   └── journalService.ts
├── App.tsx                 ← Definição de rotas
└── index.css               ← Diretivas Tailwind
```

---

## Deploy

O deploy é feito automaticamente via GitHub Actions ao fazer push para `main`.

O workflow (`.github/workflows/deploy-production.yml`) conecta ao VPS por SSH, faz `git pull`, `npm install` e `npm run build`.
