import React, { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";

import TextareaAutosize from "react-textarea-autosize";
import { Link } from "react-router-dom";

import { useQuery } from "react-query";
import { makeRequest } from "../../axios.js";
import MoonLoader from "react-spinners/MoonLoader";
import moment from "moment";

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery("comments", () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })
  );

  console.log(data);

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <TextareaAutosize placeholder="Write a comment..." />
        <button>Send</button>
      </div>
      {isLoading ? (
        <MoonLoader loading={isLoading} />
      ) : (
        data.map((comment) => (
          <div className="comment">
            <img src={comment.profilePic} alt="" />
            <div className="content">
              <div className="information">
                <div className="container">
                  <p className="username">
                    <Link>{comment.name}</Link>
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
