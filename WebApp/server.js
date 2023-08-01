const express = require('express');
const { Pool } = require('pg');

const app = express();

// Configuração da conexão com o banco de dados PostgreSQL
const pool = new Pool({
  connectionString: 'postgres://postgres:senha@localhost:5432/postgres', // String de conexão com o banco de dados PostgreSQL
});

// Função para transformar os dados específicos em cada linha da consulta SQL
function transformData(rows) {
  return rows.map((row) => {
    return {
      ...row,
      data_vencimento: new Date(row.data_vencimento), // Converte data_vencimento para um objeto Date
      unidade_eletr: String(row.unidade_eletr), // Converte unidade_eletr para uma string
      unidade_injetada: String(row.unidade_injetada), // Converte unidade_injetada para uma string
      unidade_icms: String(row.unidade_icms), // Converte unidade_icms para uma string
      nome_cliente: String(row.nome_cliente), // Converte nome_cliente para uma string
    };
  });
}

// Rota para obter os dados do gráfico
app.get('/chartData', async (req, res) => {
  try {
    // Estabelece uma conexão com o banco de dados
    const client = await pool.connect();

    // Executa a consulta SQL para buscar os dados da tabela 'faturas' e ordena pelo campo 'mes_referencia' em ordem crescente
    const result = await client.query('SELECT * FROM faturas ORDER BY mes_referencia ASC');

    // Libera a conexão com o banco de dados
    client.release();

    // Transforma os dados específicos em cada linha da consulta
    const transformedData = transformData(result.rows);

    // Extrai os dados para cada coluna e aplica parseFloat nos dados numéricos (exceto colunas específicas)
    const columnsData = Object.keys(transformedData[0]).reduce((acc, key) => {
      const data = transformedData.map((row) => {
        // Utiliza parseFloat para dados numéricos (exceto colunas específicas)
        if (
          key !== 'data_vencimento' &&
          key !== 'unidade_eletr' &&
          key !== 'unidade_injetada' &&
          key !== 'unidade_icms' &&
          key !== 'nome_cliente'
        ) {
          return parseFloat(row[key]);
        }
        return row[key];
      });

      acc[key] = data;
      return acc;
    }, {});

    // Envia os dados transformados como resposta JSON
    res.json({ columnsData });
  } catch (error) {
    console.error('Erro ao obter dados do banco de dados:', error);
    res.status(500).json({ error: 'Erro ao obter dados do banco de dados' });
  }
});

// Define a porta em que o servidor vai ouvir as requisições (padrão: 3005)
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
