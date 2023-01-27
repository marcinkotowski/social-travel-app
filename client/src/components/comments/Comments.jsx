import React, { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";

import TextareaAutosize from "react-textarea-autosize";
import { Link } from "react-router-dom";

const Comments = () => {
  const { currentUser } = useContext(AuthContext);

  //TEMPORARY
  const comments = [
    {
      id: 1,
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In cumque mollitia cum laborum, debitis, autem dolores reiciendis libero quibusdam corporis aperiam iste officiis odit voluptatum ullam itaque omnis officia. Fugiat?",
      name: "Jhon asdassdasasdasadassasdsasddasddsasadasdsad",
      userId: 1,
      profilePic:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    },
    {
      id: 2,
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In cumque mollitia cum laborum, debitis, autem dolores reicie",
      name: "Jane sda",
      userId: 2,
      profilePic:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    },
  ];

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <TextareaAutosize placeholder="Write a comment..." />
        <button>Send</button>
      </div>
      {comments.map((comment) => (
        <div className="comment">
          <img src={comment.profilePic} alt="" />
          <div className="content">
            <div className="information">
              <div className="container">
                <p className="username">
                  <Link>{comment.name}</Link>
                </p>
              </div>
              <p className="timestamp">1h ago</p>
            </div>
            <p className="description">{comment.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
