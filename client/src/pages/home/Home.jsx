import React from "react";
import "./home.scss";
import Posts from "../../components/posts/Posts";
import Create from "../../components/create/Create";

const Home = () => {
  return (
    <div className="home">
      <Create />
      <Posts />
    </div>
  );
};

export default Home;
