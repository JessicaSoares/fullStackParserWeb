import axios from 'axios';
//Olá recrutador(a), bem vindo ao meu código <3 <3
const apiService = axios.create({
  baseURL: 'http://localhost:3005', // URL base da API para onde serão feitas as requisições
  headers: {
    // Cabeçalhos adicionais podem ser definidos aqui, caso necessário
  },
});

// Função para buscar os dados do gráfico da API
export const fetchChartData = async () => {
  try {
    const response = await apiService.get('/chartData'); // Faz uma requisição GET para a rota '/chartData' da API
    return response.data.columnsData; // Retorna os dados da resposta da API (colunas do gráfico)
  } catch (error) {
    // Em caso de erro, lança uma exceção com uma mensagem de erro
    throw new Error('Erro ao obter os dados do gráfico:', error);
  }
};

export default apiService; // Exporta o serviço de API como padrão
