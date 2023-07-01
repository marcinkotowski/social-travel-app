import React from "react";
import "./results.scss";
import ProfileResult from "./profile/ProfileResult";
import Posts from "../posts/Posts";

const Results = ({ type }) => {
  return (
    <div className="results">
      {type === "location" ? (
        <Posts />
      ) : type === "profile" ? (
        <ProfileResult />
      ) : (
        ""
      )}
    </div>
  );
};

export default Results;
