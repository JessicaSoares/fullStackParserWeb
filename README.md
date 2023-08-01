Sem problemas! Vamos atualizar o README para incluir essa informação.

# Web Scraping e Aplicação Web

Este repositório contém uma aplicação que realiza web scraping para coletar dados de faturas e armazená-los em um banco de dados PostgreSQL. Em seguida, uma API é construída para acessar esses dados e uma aplicação web é fornecida para visualizá-los.

## Pré-requisitos

Antes de executar a aplicação, certifique-se de ter os seguintes pré-requisitos instalados em seu sistema:

1. Node.js: [Download e Instalação](https://nodejs.org)
2. PostgreSQL: [Download e Instalação](https://www.postgresql.org/download)

## Passo a Passo

### 1. Criando o Banco de Dados

Primeiro, abra o PostgreSQL e execute o script SQL localizado na pasta `BD` para criar a tabela `faturas`. Isso garantirá que os dados coletados durante o web scraping sejam armazenados corretamente.

### 2. Executando o Web Scraping

Navegue até a pasta `scrapping` e edite o arquivo `index.js`. Insira as credenciais corretas para a conexão com o banco de dados PostgreSQL no seguinte formato:

```javascript
const connectionString = 'postgres://usuario:senha@host:porta/nome-do-banco';
```

Em seguida, execute o comando abaixo para instalar as dependências e iniciar o web scraping:

```bash
npm install
npm start
```

Isso executará o web scraping e populacionará a tabela `faturas` no banco de dados com os dados coletados.

### 3. Configurando a API

Navegue até a pasta `webapp` e edite o arquivo `server.js`. Insira as credenciais corretas para a conexão com o banco de dados PostgreSQL no seguinte formato:

```javascript
const pool = new Pool({
  connectionString: 'postgres://usuario:senha@host:porta/nome-do-banco', // String de conexão com o banco de dados PostgreSQL
});
```

Em seguida, execute o comando abaixo para instalar as dependências da API:

```bash
npm install
```

Inicie a API que fornecerá os dados do banco de dados:

```bash
node server.js
```

### 4. Executando a Aplicação Web

Para visualizar os dados coletados, navegue até a pasta `webapp` e execute o comando abaixo para iniciar a aplicação web:

```bash
npm start
```

A aplicação web será iniciada e você poderá acessá-la em seu navegador em `http://localhost:3000`. A partir daí, você poderá visualizar os dados das faturas armazenados no banco de dados PostgreSQL.

## Observações

- Certifique-se de ter o PostgreSQL em execução antes de executar qualquer etapa que envolva a conexão com o banco de dados.
- Ao executar o web scraping, verifique se o site alvo está disponível e acessível. Alterações na estrutura do site podem afetar o funcionamento do web scraping.
- Mantenha suas credenciais de banco de dados e outras informações sensíveis protegidas e não as compartilhe publicamente.
