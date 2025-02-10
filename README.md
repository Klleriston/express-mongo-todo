# Express MongoDB Todo API

API RESTful para gerenciamento de tarefas construída com Express.js, MongoDB e TypeScript.

## Tecnologias

- Node.js
- Express.js
- TypeScript
- MongoDB com Mongoose
- Zod para validação de dados
- Swagger para documentação da API

## Documentação da API

### Endpoints de Tarefas

#### Criar Tarefa
```http
POST /tasks
```

Body:
```json
{
  "title": "string",
  "description": "string",
  "status": "pendente",
  "userId": "string"
}
```

Respostas:
- `201`: Tarefa criada com sucesso
- `400`: Erro de validação (dados de entrada inválidos)

#### Listar Tarefas
```http
GET /tasks
```

Parâmetros de Query:
- `page` (integer, default: 1): Número da página
- `limit` (integer, default: 10): Quantidade de itens por página
- `userId` (string): Filtrar tarefas por usuário

Resposta (200):
```json
{
  "tasks": [
    {
      "title": "string",
      "description": "string",
      "status": "pendente",
      "userId": "string",
      "createdAt": "2025-02-10T23:32:37.300Z",
      "updatedAt": "2025-02-10T23:32:37.300Z"
    }
  ],
  "total": 0,
  "page": 0,
  "limit": 0
}
```

#### Obter Tarefa por ID
```http
GET /tasks/{id}
```

#### Atualizar Status da Tarefa
```http
PATCH /tasks/{id}/status
```

Body:
```
{
  "status": "pendente" | "em progresso" | "concluída"
}
```

#### Deletar Tarefa
```http
DELETE /tasks/{id}
```

### Endpoints de Usuários

#### Criar Usuário
```http
POST /users
```

Body:
```json
{
  "name": "João",
  "email": "joao@example.com",
  "password": "12345"
}
```

#### Listar Usuários
```http
GET /users
```

#### Obter Usuário por ID
```http
GET /users/{id}
```

#### Atualizar Usuário
```http
PUT /users/{id}
```

Body:
```json
{
  "name": "João",
  "email": "joao@example.com",
  "password": "12345"
}
```

#### Deletar Usuário
```http
DELETE /users/{id}
```

## Testes

O projeto utiliza Jest para testes unitários. Os testes estão organizados na pasta `tests/`.

Executar todos os testes:
```bash
npm test
```

## Estrutura do Projeto

```
src/
├── config/              # Configurações do projeto
├── controllers/         # Controladores da aplicação
├── errors/              # Tratamento de erros
├── interfaces/          # Interfaces e tipos
├── middlewares/         # Middlewares da aplicação
├── models/              # Modelos do MongoDB
├── routes/              # Rotas da aplicação
├── service/             # Camada de serviços
└── utils/               # Utilitários
└── server.ts            # Inicialização do servidor
```

## Instalação

1. Clone o repositório
```bash
git clone https://github.com/Klleriston/express-mongo-todo.git
cd express-mongo-todo
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
MONGO_INITDB_ROOT_USERNAME=user
MONGO_INITDB_ROOT_PASSWORD=password
MONGO_INITDB_DATABASE=database
MONGO_INITDB_PORT=27017
MONGODB_URI=mongodb://user:password@mongodb:27017/database?authSource=admin&directConnection=true
PORT=3000
```

4. Inicie o servidor
```bash
npm run dev
```

## Documentação Swagger

A documentação completa da API está disponível em:
```
http://localhost:3000/api-docs
```

## Ambiente Docker

O projeto inclui configuração Docker para facilitar o desenvolvimento e a implantação. Use Docker Compose para iniciar todos os serviços necessários.

Arquivos Docker:

```
.
├── Dockerfile
└── docker-compose.yml
```

Serviços Disponíveis:

- API: Aplicação Node.js
- MongoDB: Banco de dados

### Comandos Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Visualizar logs
docker-compose logs -f

# Rebuildar serviços
docker-compose up -d --build
```

### Configuração do Docker Compose

```yaml
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: backend_container
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - MONGO_URI=${MONGODB_URI}
    networks:
      - backend_network
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    container_name: mongodb_container
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}
      - MONGO_INITDB_DATABASE=${MONGO_INITDB_DATABASE}
    ports:
      - "27017:27017"
    volumes:
      - ./data/mongodb:/data/db
    networks:
      - backend_network

networks:
  backend_network:
    driver: bridge
```

### Acessando os Serviços

- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api-docs
- **MongoDB**: mongodb://localhost:27017

## Scripts Disponíveis

```json
"scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "npm run build && nodemon --exec ts-node ./src/server.ts",
    "test": "jest",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write ."
}
```

## Autor

- [@Klleriston](https://github.com/Klleriston)
