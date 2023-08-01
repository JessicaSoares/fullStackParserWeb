import React, { useState, useEffect } from "react";
import "./HistoryInvoice.css";
import { fetchChartData } from "../../services/apiServices";

const HistoryInvoice = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("all");

  // Função para buscar os dados do gráfico ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchChartData();
        setChartData(data);
      } catch (error) {
        console.error('Erro ao buscar os dados do gráfico:', error);
      }
    };

    fetchData();
  }, []);

  // Função para atualizar o mês selecionado ao clicar nos botões
  const handleButtonClick = (month) => {
    setSelectedMonth(month);
  };

  // Verificação se os dados do gráfico já foram carregados
  if (!chartData) {
    return <p>Carregando os dados do gráfico...</p>;
  }

  // Filtrar os dados com base no mês selecionado
  const filteredData =
    selectedMonth === "all"
      ? chartData
      : {
          ...chartData,
          nome_cliente: chartData.nome_cliente.filter(
            (_, index) => chartData.mes_referencia[index] === Number(selectedMonth)
          ),
          valor_eletr: chartData.valor_eletr.filter(
            (_, index) => chartData.mes_referencia[index] === Number(selectedMonth)
          ),
          kw_mes: chartData.kw_mes.filter(
            (_, index) => chartData.mes_referencia[index] === Number(selectedMonth)
          ),
          numero_cliente: chartData.numero_cliente.filter(
            (_, index) => chartData.mes_referencia[index] === Number(selectedMonth)
          ),
        };

  return (
    <div className="historyInvoice">
      <div className="button-container">
        <button className={selectedMonth === "all" ? "active" : ""} onClick={() => handleButtonClick("all")}>Todos os meses</button>
        <button className={selectedMonth === "1" ? "active" : ""} onClick={() => handleButtonClick("1")}>Janeiro</button>
        <button className={selectedMonth === "2" ? "active" : ""} onClick={() => handleButtonClick("2")}>Fevereiro</button>
        <button className={selectedMonth === "3" ? "active" : ""} onClick={() => handleButtonClick("3")}>Março</button>
        <button className={selectedMonth === "4" ? "active" : ""} onClick={() => handleButtonClick("4")}>Abril</button>
        <button className={selectedMonth === "5" ? "active" : ""} onClick={() => handleButtonClick("5")}>Maio</button>
        <button className={selectedMonth === "6" ? "active" : ""} onClick={() => handleButtonClick("6")}>Junho</button>
      </div>

      <div className="card-container">
        <table>
          <thead>
            <tr className="green-header">
              <th>Número do Cliente</th>
              <th>Nome do Cliente</th>
              <th>Valor Eletr</th>
              <th>Total de KW</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.nome_cliente.map((cliente, id) => (
              <tr key={id}>
                <td>{filteredData.numero_cliente[id]}</td>
                <td>{cliente}</td>
                <td>R$ {filteredData.valor_eletr[id]}</td>
                <td>{filteredData.kw_mes[id]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryInvoice;
