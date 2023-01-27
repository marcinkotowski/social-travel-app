import React from "react";
import "./explore.scss";
import Post from "../../components/post/Post.jsx";

const Explore = () => {
  return (
    <div className="explore">
      <div className="posts-container">
        <Post />
      </div>
    </div>
  );
};

export default Explore;
