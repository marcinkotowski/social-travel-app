import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import "./profileResults.scss";

const ProfileResults = ({ users }) => {
  return (
    <>
      {users.length > 0 ? (
        <div className="profile-result">
          {users.map((user) => (
            <div className="result" key={user.id}>
              <Link to={`/profile/${user.id}`}>
                <div className="user-avatar">
                  <img src={user.profilePic} alt="" />
                </div>
                <div className="information">
                  <p className="full-name">{user.name}</p>
                  <p className="username">@{user.username}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results">No users matching your search phrase</p>
      )}
    </>
  );
};

export default ProfileResults;
