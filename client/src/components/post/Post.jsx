import React from "react";
import { Link } from "react-router-dom";

import "./post.scss";
import {
  MdFavoriteBorder,
  MdFavorite,
  MdBookmark,
  MdOutlineBookmarkBorder,
  MdOutlineComment,
  MdComment,
} from "react-icons/md";

import Zdj from "../../assets/tlo.jpg";
import Zdj2 from "../../assets/tlo2.jpg";
import Avatar from "../../assets/avatar.jpg";
import Pl from "../../assets/pl.jpg";
import En from "../../assets/en.jpg";
import N from "../../assets/n.png";
import Comments from "../comments/Comments";
import { useState } from "react";
import moment from "moment";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);

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
          <div className="location">
            <img src={post.location} alt="" />
          </div>
        </div>
        <div className="description">
          <p>{post.desc}</p>
        </div>
        {post.img && (
          <div className="images">
            <img src={"./upload/" + post.img} alt="" />
          </div>
        )}
        <div className="actions-container">
          <div className="action">
            <MdFavoriteBorder />
            <p>0</p>
          </div>
          <div className="action" onClick={() => setCommentOpen(!commentOpen)}>
            <MdOutlineComment />
            <p>1</p>
          </div>
          <div className="action">
            <MdOutlineBookmarkBorder />
            <p>Save</p>
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
