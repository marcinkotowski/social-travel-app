import React, { useCallback, useEffect, useState } from "react";
import "./search.scss";
import { IoMdSearch } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import debounce from "lodash/debounce";
import Results from "../../components/results/Results";
import { makeRequest } from "../../axios";
import { searchLocations } from "../../utils/searchLocations";
import Address from "../../components/address/Address";
import TextareaAutosize from "react-textarea-autosize";
import MoonLoader from "react-spinners/MoonLoader";
import Posts from "../../components/posts/Posts";

const Search = () => {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const [type, setType] = useState("location");
  const [databaseSearching, setDatabaseSearching] = useState(false);
  const [locationSearching, setLocationSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState(false);

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
              setResults(response.data);
              setStatus(true);
              setDatabaseSearching(false);
            } else {
              const data = await searchLocations(query);
              setLocations(data);
              setLocationSearching(false);
            }
          } else if (type === typeArray[1]) {
            const response = await makeRequest.get(`/search?query=${query}`);
            setResults(response.data);
            setStatus(true);
            setDatabaseSearching(false);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }, 1500),
    []
  );

  const handleSearching = useCallback(
    debounce((query, type, selectedLocation) => {
      if (query.length > 0) {
        if (type === typeArray[0]) {
          if (selectedLocation) {
            setDatabaseSearching(true);
          } else {
            setLocationSearching(true);
          }
        } else if (type === typeArray[1]) {
          setDatabaseSearching(true);
        }
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
    if (query.length == 0) {
      setStatus(false);
    }
    if (selectedLocation || query.length == 0) {
      setSelectedLocation("");
      setLocations([]);
    }
    setDatabaseSearching(false);
    setLocationSearching(false);
    handleSearching(query, type, selectedLocation);
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
          {locationSearching ? (
            <MoonLoader
              loading={locationSearching}
              speedMultiplier={0.7}
              size={20}
              cssOverride={{ margin: "0 auto" }}
            />
          ) : (
            type === "location" &&
            !selectedLocation &&
            locations.length > 0 && (
              <div className="location-result">
                {locations.map(({ customDisplayName, ...other }, key) => (
                  <Address
                    key={key}
                    customDisplayName={customDisplayName}
                    other={other}
                    handleSelectedLocation={handleSelectedLocation}
                  />
                ))}
              </div>
            )
          )}
          <div className="category params">
            {typeArray.map((name) => (
              <button
                onClick={() => {
                  setType(name);
                  setStatus(false);
                  setQuery("");
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
      <div className="results-container">
        {databaseSearching ? (
          <MoonLoader
            loading={databaseSearching}
            speedMultiplier={0.7}
            size={25}
            cssOverride={{ margin: "0 auto" }}
          />
        ) : (
          status == true && <Results type={type} results={results} />
        )}
      </div>
    </div>
  );
};

export default Search;
