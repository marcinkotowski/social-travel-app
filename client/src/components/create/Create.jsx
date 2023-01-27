import React, { useCallback } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import TextareaAutosize from "react-textarea-autosize";
import "./create.scss";
import {
  MdAddLocationAlt,
  MdOutlineInsertPhoto,
  MdOpenInNew,
} from "react-icons/md";
import { useState } from "react";
import debounce from "lodash/debounce";
import axios from "axios";
import { makeRequest } from "../../axios";
import MoonLoader from "react-spinners/MoonLoader";
import { dataSzczecin } from "../../assets/data";
import { useMutation, useQueryClient } from "react-query";

const Create = () => {
  const [addLocation, setAddLocation] = useState(false);
  const [query, setQuery] = useState("");
  const [searchingDebounce, setSearchingDebounce] = useState(false);
  const [data, setData] = useState("");
  const [selectedlocation, setSelectedlocation] = useState("");
  const [anonymousLocation, setAnonymousLocation] = useState(false);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries("posts");
      },
    }
  );
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setSelectedlocation("");
    setData("");
    setSearchingDebounce(false);

    const { value } = e.target;
    setQuery(value);
    handleSearching(value);
    handleSearch(value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ desc, img: imgUrl });
    setDesc("");
    setFile(null);
    setQuery("");
    setData("");
    setSelectedlocation("");
    setAnonymousLocation(false);
    setAddLocation(false);
    console.log(desc);
  };

  const handleSelectedLocation = (result) => {
    const display_name =
      result.display_name.split(", ")[0] +
      ", " +
      result.display_name.split(", ")[1];

    setSelectedlocation({
      lat: result.lat,
      long: result.long,
      display_name,
    });
    setQuery(display_name);
  };

  const handleSearch = useCallback(
    debounce((query) => {
      if (query.length > 0) {
        // axios
        //   .get(
        //     `https://nominatim.openstreetmap.org/search?q=${query}&format=json&adressdetails=1&limit=6`
        //   )
        //   .then((res) => {
        //     res = res.data;

        //     res = res.map(({ lat, lon, display_name }) => {
        //       return { lat, lon, display_name };
        //     });
        //     /* Remove redundant properties */

        //     res = res.filter(
        //       (curr, index, self) =>
        //         index ===
        //         self.findIndex(
        //           (location) => location.display_name === curr.display_name
        //         )
        //     );
        //     /* Remove all duplicates from an array of response */

        //     setData(res);
        //   });

        /* TEMPORARY */
        let dataLoc = dataSzczecin;

        dataLoc = dataLoc.map(({ lat, lon, display_name }) => {
          return { lat, lon, display_name };
        });
        /* Remove redundant properties */

        dataLoc = dataLoc.filter(
          (curr, index, self) =>
            index ===
            self.findIndex(
              (location) => location.display_name === curr.display_name
            )
        );

        setData(dataLoc);
        /* Remove all duplicates from an array of response */
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

  return (
    <div className="create">
      <div className="content">
        <div className="write">
          <img src={currentUser.profilePic} alt="" />
          <TextareaAutosize
            placeholder="That joruney was..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className="add-location">
          <div className="add">
            <MdAddLocationAlt />
            {addLocation ? (
              <div className="search">
                {anonymousLocation ? (
                  <p>Anonymous location</p>
                ) : (
                  <TextareaAutosize
                    className={!selectedlocation && "border"}
                    type="text"
                    placeholder="Search location..."
                    value={query}
                    onChange={handleChange}
                  />
                )}

                <div className="location-option">
                  {query.length === 0 && !searchingDebounce ? (
                    <p
                      className="cancel"
                      onClick={() => setAddLocation(!addLocation)}
                    >
                      Cancel
                    </p>
                  ) : (
                    <div className="see-on-map">
                      <MoonLoader
                        loading={searchingDebounce}
                        speedMultiplier={0.7}
                        size={15}
                      />
                      {selectedlocation && (
                        <>
                          <p>See on map</p>
                          <MdOpenInNew />
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p>
                <span
                  onClick={() => {
                    setAnonymousLocation(false);
                    setAddLocation(!addLocation);
                  }}
                >
                  Add location
                </span>{" "}
                /{" "}
                <span
                  onClick={() => {
                    setAddLocation(!addLocation);
                    setAnonymousLocation(true);
                  }}
                >
                  anonymous
                </span>
              </p>
            )}
          </div>
          {data && !selectedlocation && (
            <div className="search-result">
              {data &&
                data.map((result) => (
                  <p
                    key={result.key}
                    onClick={() => handleSelectedLocation(result)}
                  >
                    {result.display_name}
                  </p>
                ))}
            </div>
          )}
        </div>
        <div className="add-photos">
          <MdOutlineInsertPhoto />
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && <img src={URL.createObjectURL(file)} />}
          <label htmlFor="file">
            <p>
              <span>{file ? "Change" : "Add Media"} </span>
            </p>
          </label>
          <button onClick={handleClick}>Publish</button>
        </div>

        {/* <hr /> */}
      </div>
    </div>
  );
};

export default Create;
