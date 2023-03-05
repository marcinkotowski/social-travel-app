import React from "react";
import "./results.scss";
import CountryResult from "./country/CountryResult";
import ProfileResult from "./profile/ProfileResult";

const Results = ({ type, category }) => {
  return (
    <div className="results">
      {type === "location" ? (
        <CountryResult />
      ) : type === "profile" ? (
        <ProfileResult />
      ) : (
        ""
      )}
    </div>
  );
};

export default Results;
