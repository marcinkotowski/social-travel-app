import React from "react";
import "./saved.scss";
import Posts from "../../components/posts/Posts";

const Saved = () => {
  return (
    <div className="saved">
      <Posts saved={true} />
    </div>
  );
};

export default Saved;
