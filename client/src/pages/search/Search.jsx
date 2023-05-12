import React, { useCallback, useState } from "react";
import "./search.scss";
import { IoMdSearch } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import debounce from "lodash/debounce";
import { useSearchParams } from "react-router-dom";
import Posts from "../../components/posts/Posts";
import { MdFavorite } from "react-icons/md";
import Results from "../../components/results/Results";
import { makeRequest } from "../../axios";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams({});
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "location"
  );
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const category = ["location", "profile"];

  const handleFilter = useCallback(
    debounce((value) => {
      if (value.length > 0) {
        // const getProfile = async () => {
        //   try {
        //     const res = await makeRequest.get(`/search/profile`);
        //     console.log(res);
        //   } catch (err) {
        //     console.error(err);
        //   }
        // };
        // getProfile();
        makeRequest.get(`/search/profile`).then((res) => {
          console.log(res.data);
        });
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
          <div className="category params">
            {category.map((name) => (
              <button
                onClick={() => {
                  setSelectedCategory(name);
                }}
                className={name === selectedCategory ? "active" : ""}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Results category={selectedCategory} />
    </div>
  );
};

export default Search;
