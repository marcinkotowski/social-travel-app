import React, { useCallback, useState } from "react";
import "./search.scss";
import { IoMdSearch } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import debounce from "lodash/debounce";

const Search = () => {
  const [query, setQuery] = useState("");

  const handleFilter = useCallback(
    debounce((value) => {
      /* Fetch */
    }, 1500),
    []
  );

  const handleChange = (value) => {
    setQuery(value);
    // handleFilter(value);
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
                <MdCancel onClick={() => setQuery("")} />
              </div>
            )}
          </label>
        </div>
        <div className="results"></div>
      </div>
    </div>
  );
};

export default Search;
