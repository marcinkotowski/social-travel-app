import React from "react";
import "./results.scss";
import CountryResult from "./country/CountryResult";

const Results = ({ type, category }) => {
  return (
    <div className="results">
      {type === "location" ? <CountryResult /> : type === "profile"}
    </div>
  );
};

export default Results;
