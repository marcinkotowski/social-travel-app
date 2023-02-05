import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.scss";
import { IconContext } from "react-icons";
import {
  FaMapMarkedAlt,
  FaRegUserCircle,
  FaUserCircle,
  FaSearch,
} from "react-icons/fa";
import { RiCompass3Line, RiCompass3Fill } from "react-icons/ri";
import {
  MdAddLocation,
  MdOutlineAddLocation,
  MdSearch,
  MdBookmark,
  MdOutlineBookmarkBorder,
} from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { FiBookmark } from "react-icons/fi";
import { CgSearch } from "react-icons/cg";
import { IoMdSearch } from "react-icons/io";

import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="fixed-sidebar">
      <div className="sidebar">
        <div className="top">
          <Link to={"/"}>
            <div className="icon">
              <FaMapMarkedAlt />
              <span>Journey</span>
            </div>
          </Link>
          <Link to={"/"}>
            <div className="icon">
              <AiOutlineHome />
              {/* <AiFillHome /> */}
              <span>Home</span>
            </div>
          </Link>
          <Link to={"/"}>
            <div className="icon">
              <IoMdSearch />
              <span>Search</span>
            </div>
          </Link>
          <Link to={"/"}>
            <div className="icon">
              <RiCompass3Line />
              {/* <RiCompass3Fill /> */}
              <span>Explore</span>
            </div>
          </Link>
          <Link to={"/saved"}>
            <div className="icon">
              <MdOutlineBookmarkBorder />
              {/* <MdBookmark /> */}
              <span>Saved</span>
            </div>
          </Link>
        </div>
        <div className="bottom">
          {currentUser ? (
            <Link to={`/profile/${currentUser.id}`}>
              <div className="user">
                <img src={currentUser.profilePic} alt="" />
                <span>{currentUser.name}</span>
              </div>
            </Link>
          ) : (
            <div className="icon">
              <FaRegUserCircle />
              <button>Sign up</button>
            </div>
          )}

          {/* <FaUserCircle /> */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
