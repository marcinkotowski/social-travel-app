import React from "react";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "react-query";
import { makeRequest } from "../../axios.js";
import MoonLoader from "react-spinners/MoonLoader";

const Posts = ({ userId, type }) => {
  const { isLoading, error, data } = useQuery(["posts", userId], () => {
    if (userId) {
      return makeRequest.get(`/posts/${userId}`).then((res) => {
        return res.data;
      });
    } else {
      return makeRequest.get(`/posts/?type=${type}`).then((res) => {
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
      ) : data.length ? (
        data.map((post) => <Post post={post} key={post.id} />)
      ) : (
        <p>No matching results</p>
      )}
    </div>
  );
};

export default Posts;
