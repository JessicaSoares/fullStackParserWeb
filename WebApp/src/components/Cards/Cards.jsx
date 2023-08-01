import React, { useState, useEffect } from "react";
import "./Cards.css";
import { fetchChartData } from "../../services/apiServices";
import { UilUsdSquare, UilMoneyWithdrawal } from "@iconscout/react-unicons";

const Cards = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("1");

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

  const handleMonthButtonClick = (month) => {
    setSelectedMonth(month);
  };

  if (!chartData) {
    return <p>Loading chart data...</p>;
  }

  // Associando o número do mês ao seu nome em português
  const monthNames = {
    1: "Janeiro",
    2: "Fevereiro",
    3: "Março",
    4: "Abril",
    5: "Maio",
    6: "Junho",
  };

  // Criando um array ordenado com base nos números dos meses
  const sortedMonths = Object.entries(monthNames)
    .sort((a, b) => a[0] - b[0])
    .map(([monthNumber, monthName]) => ({
      monthNumber,
      monthName,
    }));

  const filteredData =
    selectedMonth === "all"
      ? chartData
      : {
          ...chartData,
          valor_total: chartData.valor_total.filter(
            (_, index) => chartData.mes_referencia[index] === Number(selectedMonth)
          ),
        };

  const filteredData1 =
    selectedMonth === "all"
      ? chartData
      : {
          ...chartData,
          contrib_ilum_publica: chartData.contrib_ilum_publica.filter(
            (_, index) => chartData.mes_referencia[index] === Number(selectedMonth)
          ),
        };

  const filteredData2 =
    selectedMonth === "all"
      ? chartData
      : {
          ...chartData,
          quantidade_eletr: chartData.quantidade_eletr.filter(
            (_, index) => chartData.mes_referencia[index] === Number(selectedMonth)
          ),
        };

  const filteredData3 =
    selectedMonth === "all"
      ? chartData
      : {
          ...chartData,
          kw_mes: chartData.kw_mes.filter(
            (_, index) => chartData.mes_referencia[index] === Number(selectedMonth)
          ),
        };

  return (
    <div className="selectcard">
      <div className="button-container">
        {sortedMonths.map(({ monthNumber, monthName }) => (
          <button
            key={monthNumber}
            className={selectedMonth === monthNumber.toString() ? "active" : ""}
            onClick={() => handleMonthButtonClick(monthNumber.toString())}
          >
            {monthName}
          </button>
        ))}
      </div>

      <div className="card-container">
        {filteredData.valor_total.map((value, id) => {
          return (
            <div className="custom-card" key={id}>
              <div className="card-icon">
                <UilUsdSquare size={32} color="#0d855d" />
              </div>
              <div className="card-title">Valor Total</div>
              <div className="card-content">
                <div className="card-value">R$ {value}</div>
              </div>
            </div>
          );
        })}

        {filteredData1.contrib_ilum_publica.map((value, id) => {
          return (
            <div className="custom-card" key={id}>
              <div className="card-icon">
                <UilMoneyWithdrawal size={32} color="#0d855d" />
              </div>
              <div className="card-title">Iluminação Pública</div>
              <div className="card-content">
                <div className="card-value">R$ {value}</div>
              </div>
            </div>
          );
        })}

        {filteredData2.quantidade_eletr.map((value, id) => {
          return (
            <div className="custom-card" key={id}>
              <div className="card-icon">
                <UilUsdSquare size={32} color="#0d855d" />
              </div>
              <div className="card-title">Quantidade de Energia</div>
              <div className="card-content">
                <div className="card-value">{value}</div>
              </div>
            </div>
          );
        })}

        {filteredData3.kw_mes.map((value, id) => {
          return (
            <div className="custom-card" key={id}>
              <div className="card-icon">
                <UilMoneyWithdrawal size={32} color="#0d855d" />
              </div>
              <div className="card-title">Kw Total</div>
              <div className="card-content">
                <div className="card-value">{value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cards;
