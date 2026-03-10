# Institucional

Aplicação web institucional full-stack com painel administrativo, gerenciamento de produtos, notícias, categorias e destaques.

## 🚀 Deploy

| Serviço | Responsabilidade |
|---|---|
| **Vercel** | Frontend (React + Vite) |
| **Render** | Backend (Node.js + Express) |
| **Supabase** | Banco de dados (PostgreSQL) |

---

## 🛠️ Tecnologias

### Frontend
- [React 19](https://react.dev/) — biblioteca de UI
- [Vite 7](https://vitejs.dev/) — bundler e dev server
- [React Router v7](https://reactrouter.com/) — roteamento SPA
- [Axios](https://axios-http.com/) — requisições HTTP
- CSS Modules — estilos escopados por componente

### Backend
- [Node.js](https://nodejs.org/) com ES Modules
- [Express 5](https://expressjs.com/) — framework HTTP
- [Sequelize 6](https://sequelize.org/) — ORM
- [PostgreSQL](https://www.postgresql.org/) — banco de dados relacional
- [JWT](https://jwt.io/) — autenticação via token
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) — hash de senhas
- [Multer](https://github.com/expressjs/multer) — upload de imagens

### Infraestrutura
- [Docker](https://www.docker.com/) + Docker Compose — ambiente de desenvolvimento local
- [Nginx](https://nginx.org/) — servidor do frontend em produção

---

## ⚙️ Como rodar localmente

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução

### 1. Clone o repositório

```bash
git clone https://github.com/FelipeFDN/Institucional.git
cd Institucional
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (junto ao `docker-compose.yaml`):

### 3. Suba os containers

```bash
docker compose up -d
```

A aplicação estará disponível em:

| Serviço | URL |
|---|---|
| Frontend | http://localhost:80 |
| Backend (API) | http://localhost:3000/api |
| Banco de dados | localhost:5432 |

---

## 🔐 Painel Administrativo

Acesse `/login` para entrar no painel. O painel permite gerenciar:

- **Produtos** e **Categorias de produtos**
- **Notícias** (com galeria de imagens)
- **Destaques** (carrossel hero da home)
- **Usuários**