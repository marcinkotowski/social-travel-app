import React from "react";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "react-query";
import { makeRequest } from "../../axios.js";
import MoonLoader from "react-spinners/MoonLoader";

const Posts = ({ userId, saved }) => {
  const { isLoading, error, data } = useQuery("posts", () => {
    if (saved) {
      return makeRequest.get("/posts/saved").then((res) => {
        return res.data;
      });
    } else {
      return makeRequest.get("/posts/all?userId=" + userId).then((res) => {
        return res.data;
      });
    }
  });

  return (
    <div className="posts">
      {error ? (
        <p className="error">Something went wrong</p>
      ) : isLoading ? (
        <MoonLoader loading={isLoading} speedMultiplier={0.7} size={30} />
      ) : (
        data.map((post) => <Post post={post} key={post.id} />)
      )}
    </div>
  );
};

export default Posts;
