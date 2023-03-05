import React from "react";
import "./countryResult.scss";
import { GoArrowUp, GoArrowDown } from "react-icons/go";
import { MdNavigateNext } from "react-icons/md";

const CountryResult = () => {
  return (
    <div className="country-result">
      <div className="result">
        <div className="rank">
          <p>1</p>
          <GoArrowUp className="up" />
        </div>
        <img
          src="https://media.cnn.com/api/v1/images/stellar/prod/181018143148-krakow-2.jpg?q=w_1600,h_801,x_0,y_0,c_fill/w_1280"
          alt=""
        />
        <p className="country">Poland</p>
        <div className="select">
          <MdNavigateNext />
        </div>
      </div>
      <div className="result">
        <div className="rank">
          <p>2</p>
          <GoArrowDown className="down" />
        </div>
        <img
          src="https://www.state.gov/wp-content/uploads/2018/11/Norway-2560x1328.jpg"
          alt=""
        />
        <p className="country">Norway</p>
        <div className="select">
          <MdNavigateNext />
        </div>
      </div>
      <div className="result">
        <div className="rank">
          <p>3</p>
        </div>
        <img
          src="https://tapetax.pl/pic/product_foto/prodfoto8924.jpg"
          alt=""
        />
        <p className="country">Italy</p>
        <div className="select">
          <MdNavigateNext />
        </div>
      </div>
    </div>
  );
};

export default CountryResult;
