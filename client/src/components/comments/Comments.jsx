import React, { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import TextareaAutosize from "react-textarea-autosize";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../axios.js";
import MoonLoader from "react-spinners/MoonLoader";
import moment from "moment";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");

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
    mutation.mutate({ desc, postId });
    console.log(desc);
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <TextareaAutosize
          placeholder="Write a comment..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading ? (
        <MoonLoader loading={isLoading} />
      ) : (
        data.map((comment, key) => (
          <div className="comment" key={key}>
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
