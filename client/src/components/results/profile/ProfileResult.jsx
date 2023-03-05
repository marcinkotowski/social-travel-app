import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import "./profileResult.scss";

const ProfileResult = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="profile-result">
      <div className="result">
        <Link to={`/profile/2`}>
          <div className="user-avatar">
            <img src={currentUser.profilePic} alt="" />
          </div>
          <div className="information">
            <p className="full-name">{currentUser.name}</p>
            <p className="username">@{currentUser.username}</p>
          </div>
        </Link>
      </div>
      <div className="result">
        <Link to={`/profile/2`}>
          <div className="user-avatar">
            <img src={currentUser.profilePic} alt="" />
          </div>
          <div className="information">
            <p className="full-name">{currentUser.name}</p>
            <p className="username">@{currentUser.username}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProfileResult;
