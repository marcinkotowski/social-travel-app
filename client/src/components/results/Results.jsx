import React from "react";
import "./results.scss";
import CountryResult from "./country/CountryResult";
import ProfileResult from "./profile/ProfileResult";

const Results = ({ category }) => {
  return (
    <div className="results">
      {category === "location" ? (
        <CountryResult />
      ) : category === "profile" ? (
        <ProfileResult />
      ) : (
        ""
      )}
    </div>
  );
};

export default Results;
