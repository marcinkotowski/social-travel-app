import React, { useContext, useRef, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import TextareaAutosize from "react-textarea-autosize";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../axios.js";
import MoonLoader from "react-spinners/MoonLoader";
import moment from "moment";

const Comments = ({ postId }) => {
  const desc = useRef(null);

  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery("comments", () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries("comments");
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc: desc.current.value, postId });
    desc.current.value = "";
  };

  return (
    <div className="comments">
      <div className="write">
        <Link to={`/profile/${currentUser.id}`}>
          <img src={currentUser.profilePic} alt="" />
        </Link>
        <TextareaAutosize placeholder="Write a comment..." ref={desc} />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading ? (
        <MoonLoader loading={isLoading} />
      ) : (
        data.map((comment, key) => (
          <div className="comment" key={key}>
            <Link to={`/profile/${comment.userId}`}>
              <img src={comment.profilePic} alt="" />
            </Link>
            <div className="content">
              <div className="information">
                <div className="container">
                  <p className="username">
                    <Link to={`/profile/${comment.userId}`}>
                      {comment.name}
                    </Link>
                  </p>
                </div>
                <p className="timestamp">
                  {moment(comment.createdAt).fromNow()}
                </p>
              </div>
              <p className="description">{comment.desc}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
