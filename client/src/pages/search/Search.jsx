import React, { useCallback, useState } from "react";
import "./search.scss";
import { IoMdSearch } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import debounce from "lodash/debounce";
import { useSearchParams } from "react-router-dom";
import Posts from "../../components/posts/Posts";
import { AiFillFire, AiOutlineClockCircle } from "react-icons/ai";
import { MdFavorite, MdNavigateNext } from "react-icons/md";
import { GoArrowUp, GoArrowDown } from "react-icons/go";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams({});
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "location"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "trnd"
  );
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const type = ["location", "profile"];
  const category = [
    {
      name: "trending",
      svg: <AiFillFire style={{ color: "#f7a100" }} />,
      abbreviation: "trnd",
    },
    { name: "most popular", svg: <MdFavorite />, abbreviation: "mp" },
    { name: "latest", svg: <AiOutlineClockCircle />, abbreviation: "lst" },
  ];

  const handleFilter = useCallback(
    debounce((value) => {
      if (value.length > 0) {
        console.log("fetch: " + value);
        /* Fetch */
      }
    }, 1500),
    []
  );

  const handleChange = (value) => {
    setQuery(value);
    handleFilter(value);
    if (value.length > 0) {
      setSearchParams({
        q: value,
        type: selectedType,
        category: selectedCategory,
      });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="search-container">
      <div className="search">
        <div className="filter">
          <label htmlFor="filter">
            <div className="icon">
              <IoMdSearch />
            </div>
            <input
              type="text"
              id="filter"
              placeholder="Search"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              maxLength="50"
            />
            {query && (
              <div className="icon cancel">
                <MdCancel onClick={() => handleChange("")} />
              </div>
            )}
          </label>
          <div className="type params">
            {type.map((name) => (
              <button
                onClick={() => {
                  setSelectedType(name);
                }}
                className={name === selectedType ? "active" : ""}
              >
                {name}
              </button>
            ))}
          </div>
          {selectedType != "profile" && !query && (
            <div className="category params">
              {category.map(({ name, svg, abbreviation }) => (
                <button
                  onClick={() => {
                    setSelectedCategory(abbreviation);
                  }}
                  className={
                    abbreviation === selectedCategory && !query ? "active" : ""
                  }
                >
                  {svg}
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="result-container">
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
    </div>
  );
};

export default Search;
