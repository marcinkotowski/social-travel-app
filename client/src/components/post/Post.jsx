import React, { useContext } from "react";
import { Link } from "react-router-dom";

import "./post.scss";
import {
  MdFavoriteBorder,
  MdFavorite,
  MdBookmark,
  MdOutlineBookmarkBorder,
  MdOutlineComment,
  MdComment,
  MdOutlineReportProblem,
} from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { GoReport } from "react-icons/go";
import { AiOutlineDelete } from "react-icons/ai";

import Zdj from "../../assets/tlo.jpg";
import Zdj2 from "../../assets/tlo2.jpg";
import Avatar from "../../assets/avatar.jpg";
import Pl from "../../assets/pl.jpg";
import En from "../../assets/en.jpg";
import N from "../../assets/n.png";
import padLock from "../../assets/padlock.png";
import anonymous from "../../assets/anonymous.png";
import Comments from "../comments/Comments";
import { useState } from "react";
import moment from "moment";

import { useQuery, useQueryClient, useMutation } from "react-query";
import { makeRequest } from "../../axios.js";
import { AuthContext } from "../../context/authContext";
import MoonLoader from "react-spinners/MoonLoader";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const {
    isLoading: likeIsLoading,
    error: likeError,
    data: likeData,
  } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes/?postId=" + post.id).then((res) => {
      return res.data;
    })
  );
  const {
    isLoading: savedIsLoading,
    error: savedError,
    data: savedData,
  } = useQuery(["saved", post.id], () =>
    makeRequest.get("/saved/?postId=" + post.id).then((res) => {
      return res.data;
    })
  );

  const likeMutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries("likes");
      },
    }
  );
  const savedMutation = useMutation(
    (saved) => {
      if (saved) return makeRequest.delete("/saved?postId=" + post.id);
      return makeRequest.post("/saved", { postId: post.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries("saved");
      },
    }
  );

  const handleLike = () => {
    likeMutation.mutate(likeData?.includes(currentUser.id));
  };
  const handleSave = () => {
    savedMutation.mutate(savedData?.includes(currentUser.id));
  };

  return (
    <div className="post">
      <div className="content">
        <div className="headline">
          <div className="user">
            <Link to={`/profile/${post.userId}`}>
              <div className="user-avatar">
                <img src={post.profilePic} alt="" />
              </div>
            </Link>
            <div className="information">
              <p className="username">
                <Link to={`/profile/${post.userId}`}>{post.name}</Link>
              </p>
              <p className="timestamp">{moment(post.createdAt).fromNow()}</p>
            </div>
          </div>
          <div className="options-container">
            {!optionsOpen && (
              <SlOptionsVertical onClick={() => setOptionsOpen(true)} />
            )}
            {optionsOpen && (
              <div className="options">
                {post.userId === currentUser.id ? (
                  <p>
                    <span>
                      <AiOutlineDelete />
                    </span>
                    <span>Delete</span>
                  </p>
                ) : (
                  <p>
                    <span>
                      <GoReport />
                    </span>
                    <span>Report</span>
                  </p>
                )}
                <p onClick={() => setOptionsOpen(false)}>Cancel</p>
              </div>
            )}
          </div>
          <div className="location">
            <img
              crossOrigin="true"
              src={
                post.country
                  ? `https://countryflagsapi.com/png/${post.country?.toLowerCase()}`
                  : anonymous
              }
              alt={post.country ? `${post.country} flag` : anonymous}
              title={post.country ? `${post.country}` : "Anonymous location"}
            />
          </div>
        </div>
        <div className="description">
          <p>{post.desc}</p>
        </div>
        {post.img && (
          <div className="images">
            <img src={"/upload/" + post.img} alt="" />
          </div>
        )}
        <div className="actions-container">
          {(likeError || savedData) === true ? (
            <p className="error">Something went wrong</p>
          ) : likeIsLoading ? (
            <MoonLoader
              loading={likeIsLoading || savedData}
              speedMultiplier={0.7}
              size={15}
            />
          ) : (
            <>
              <div className="action" onClick={handleLike}>
                {likeData?.includes(currentUser.id) ? (
                  <MdFavorite />
                ) : (
                  <MdFavoriteBorder />
                )}
                <p>{likeData?.length}</p>
              </div>
              <div
                className="action"
                onClick={() => setCommentOpen(!commentOpen)}
              >
                <MdOutlineComment />
                <p>1</p>
              </div>
              <div className="action" onClick={handleSave}>
                {savedData?.includes(currentUser.id) ? (
                  <>
                    <MdBookmark />
                    <p>Saved</p>
                  </>
                ) : (
                  <>
                    <MdOutlineBookmarkBorder />
                    <p>Save</p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
