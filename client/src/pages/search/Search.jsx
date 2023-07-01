import React, { useCallback, useEffect, useState } from "react";
import "./search.scss";
import { IoMdSearch } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import debounce from "lodash/debounce";
import { useSearchParams } from "react-router-dom";
import Results from "../../components/results/Results";
import { makeRequest } from "../../axios";
import { searchLocations } from "../../utils/searchLocations";
import Address from "../../components/address/Address";
import TextareaAutosize from "react-textarea-autosize";

const Search = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("location");
  const [searchingDebounce, setSearchingDebounce] = useState(false);
  const [data, setData] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const typeArray = ["location", "profile"];

  const handleSearch = useCallback(
    debounce(async (query, type, selectedLocation) => {
      if (query.length > 0) {
        try {
          if (type === typeArray[0]) {
            if (selectedLocation) {
              const { lat, lon } = selectedLocation;
              const response = await makeRequest.get(
                `/search?lat=${lat}&lon=${lon}`
              );
              console.log(response.data);
            } else {
              const data = await searchLocations(query);
              setData(data);
            }
          } else if (type === typeArray[1]) {
            const response = await makeRequest.get(`/search?query=${query}`);
            console.log(response.data);
          }
        } catch (err) {
          console.error(err);
        }
      }

      setSearchingDebounce(false);
    }, 1500),
    []
  );

  const handleSearching = useCallback(
    debounce((query) => {
      if (query.length > 0) {
        setSearchingDebounce(true);
      }
    }, 500),
    []
  );

  const handleSelectedLocation = (customDisplayName, other) => {
    const { lat, lon } = other;
    const { detail, region, territory } = customDisplayName;

    setSelectedLocation({
      lat,
      lon,
    });

    let customQuery;
    if (detail) {
      customQuery = `${detail} \n${region} \n${territory}`;
    } else if (region) {
      customQuery = `${region} \n${territory}`;
    } else {
      customQuery = territory;
    }

    setQuery(customQuery);
  };

  useEffect(() => {
    if (selectedLocation || query.length == 0) {
      setSelectedLocation("");
      setData("");
    }
    setSearchingDebounce(false);
    handleSearching(query);
    handleSearch(query, type, selectedLocation);
  }, [query]);

  return (
    <div className="search-container">
      <div className="search">
        <div className="filter">
          <label htmlFor="filter">
            <div className="icon">
              <IoMdSearch />
            </div>
            <TextareaAutosize
              className={!selectedLocation ? "border" : ""}
              type="text"
              placeholder={"Search"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <div className="icon cancel">
                <MdCancel
                  onClick={() => {
                    setQuery("");
                  }}
                />
              </div>
            )}
          </label>
          {type === "location" && data && !selectedLocation && (
            <div className="search-result">
              {data.map(({ customDisplayName, ...other }, key) => (
                <Address
                  key={key}
                  customDisplayName={customDisplayName}
                  other={other}
                  handleSelectedLocation={handleSelectedLocation}
                />
              ))}
            </div>
          )}
          <div className="category params">
            {typeArray.map((name) => (
              <button
                onClick={() => {
                  setType(name);
                }}
                className={name === type ? "active" : ""}
                key={name}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Results type={type} />
    </div>
  );
};

export default Search;
