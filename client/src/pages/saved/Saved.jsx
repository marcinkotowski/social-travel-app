import React from "react";
import "./saved.scss";
import Posts from "../../components/posts/Posts";

const Saved = () => {
  return (
    <div className="saved">
      <div className="posts-container">
        <Posts />
      </div>
    </div>
  );
};

export default Saved;
