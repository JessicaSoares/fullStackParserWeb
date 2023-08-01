import React, { useEffect, useState } from 'react';
import { fetchChartData } from '../../services/apiServices';
import ReactApexChart from 'react-apexcharts';
import "./Chart.css";

const Chart = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedDataKey, setSelectedDataKey] = useState('valor_total'); // Estado para controlar o valor selecionado do filtro

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchChartData();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  // Função para ordenar os meses de referência e substituir por seus nomes
  const sortMonths = (data) => {
    return data.sort((a, b) => a - b);
  };

  const monthNames = {
    1: 'Janeiro',
    2: 'Fevereiro',
    3: 'Março',
    4: 'Abril',
    5: 'Maio',
    6: 'Junho',
    // Adicione os outros meses aqui, se necessário.
  };

  // Função para atualizar o valor selecionado do filtro
  const handleDataFilter = (dataKey) => {
    setSelectedDataKey(dataKey);
  };

  return (
    <div className="Chart">
      {chartData ? (
        <>
          <div className="button-container">
            {/* Botões para selecionar o filtro */}
            <button
              onClick={() => handleDataFilter('valor_total')}
              className={selectedDataKey === 'valor_total' ? 'active' : ''}
            >
              Valor Total
            </button>
            <button
              onClick={() => handleDataFilter('quantidade_eletr')}
              className={selectedDataKey === 'quantidade_eletr' ? 'active' : ''}
            >
              Quantidade Elétrica
            </button>
            <button
              onClick={() => handleDataFilter('contrib_ilum_publica')}
              className={selectedDataKey === 'contrib_ilum_publica' ? 'active' : ''}
            >
              Contribuição Iluminação Pública
            </button>
            <button
              onClick={() => handleDataFilter('kw_mes')}
              className={selectedDataKey === 'kw_mes' ? 'active' : ''}
            >
              KW Total
            </button>
          </div>
          <ReactApexChart
            options={{
              chart: {
                type: 'area',
              },
              xaxis: {
                categories: sortMonths(chartData.mes_referencia).map((month) => monthNames[month]),
              },
            }}
            series={[
              {
                name: selectedDataKey, // Nome da série baseado no valor selecionado do filtro
                data: chartData[selectedDataKey], // Dados da série baseado no valor selecionado do filtro
              },
            ]}
            type="area"
            height={300}
            width={1000}
          />
        </>
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default Chart;
