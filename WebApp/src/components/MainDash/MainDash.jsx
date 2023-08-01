import React from "react";
import Cards from "../Cards/Cards";
import Chart from "../Chart/Chart";
import "./MainDash.css";
const MainDash = () => {
  return (
    <div className="MainDash">
      <Cards />
      <Chart />
    </div>
  );
};

export default MainDash;
