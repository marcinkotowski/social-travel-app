import React from "react";
import "./saved.scss";
import Posts from "../../components/posts/Posts";

const Saved = () => {
  return (
    <div className="saved">
      <Posts type={"saved"} />
    </div>
  );
};

export default Saved;
