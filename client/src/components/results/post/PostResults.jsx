import React from "react";
import Post from "../../post/Post";
import "./postResults.scss";

const PostResults = ({ posts }) => {
  return (
    <>
      {posts.length > 0 ? (
        <div className="post-result">
          {posts.map((post) => (
            <Post post={post}></Post>
          ))}
        </div>
      ) : (
        <p className="no-results">No posts matching your search location</p>
      )}
    </>
  );
};

export default PostResults;
