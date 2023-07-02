import React from "react";
import "./results.scss";
import ProfileResults from "./profile/ProfileResults";
import PostResults from "./post/PostResults";

const Results = ({ type, results }) => {
  return (
    <div className="results">
      {type === "location" ? (
        <PostResults posts={results} />
      ) : type === "profile" ? (
        <ProfileResults users={results} />
      ) : (
        ""
      )}
    </div>
  );
};

export default Results;
