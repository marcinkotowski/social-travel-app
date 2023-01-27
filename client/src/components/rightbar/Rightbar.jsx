import React from "react";
import "./rightbar.scss";
import Avatar from "../../assets/avatar.jpg";

const Rightbar = () => {
  return (
    <div className="sticky">
      <div className="rightbar">
        <div className="suggestions">
          <h4>Suggestion for you</h4>
          <div className="user-suggest">
            <div className="user">
              <img src={Avatar} alt="" />
              <p>Juliusz Słowacki dlugie nazwisko</p>
            </div>
            <button>Follow</button>
          </div>
          <div className="user-suggest">
            <div className="user">
              <img src={Avatar} alt="" />
              <p>Adam Mickiewicz</p>
            </div>
            <button>Follow</button>
          </div>
          <div className="user-suggest">
            <div className="user">
              <img src={Avatar} alt="" />
              <p>Bolesław Chrobry</p>
            </div>
            <button>Follow</button>
          </div>
        </div>
        <div className="affiliate-program">
          <h4>Plan your dream trip</h4>
          <div className="affiliate-items">
            <p>Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
