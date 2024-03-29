import React, { useCallback, useEffect, useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import TextareaAutosize from "react-textarea-autosize";
import "./create.scss";
import {
  MdAddLocationAlt,
  MdOutlineInsertPhoto,
  MdOpenInNew,
  MdError,
  MdOutlinePublic,
  MdCancel,
} from "react-icons/md";
import { HiLockClosed } from "react-icons/hi";
import { BiLockAlt } from "react-icons/bi";
import { useState } from "react";
import debounce from "lodash/debounce";
import axios from "axios";
import { makeRequest } from "../../axios";
import MoonLoader from "react-spinners/MoonLoader";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import Address from "../address/Address";
import { searchLocations } from "../../utils/searchLocations";

const Create = () => {
  const [addLocation, setAddLocation] = useState(false);
  const [query, setQuery] = useState("");
  const [searchingDebounce, setSearchingDebounce] = useState(false);
  const [data, setData] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [anonymousLocation, setAnonymousLocation] = useState(false);
  const [file, setFile] = useState(null);
  const [visibilityOpen, setVisibilityOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const schema = yup.object().shape({
    desc: yup.string("Description must be string"),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

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
    setSelectedLocation("");
    setData("");
    setSearchingDebounce(false);

    const { value } = e.target;
    setQuery(value);
    handleSearching(value);
    handleSearch(value);
  };

  const handleClick = async ({ desc }) => {
    try {
      let imgUrl = "";
      if (file) imgUrl = await upload();
      mutation.mutate({ desc, img: imgUrl, selectedLocation, isPrivate });
      reset({
        desc: "",
      });
      setFile(null);
      setQuery("");
      setData("");
      setSelectedLocation("");
      setAnonymousLocation(false);
      setAddLocation(false);
    } catch (err) {
      setError("desc", { type: "custom", message: err.response.data });
    }
  };

  const handleSearch = useCallback(
    debounce(async (query) => {
      if (query.length > 0) {
        try {
          const data = await searchLocations(query);
          setData(data);
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
    const { lat, lon, address } = other;

    setSelectedLocation({
      lat,
      lon,
      customDisplayName,
      address,
    });

    const { detail, region, territory } = customDisplayName;

    if (detail) {
      setQuery(`${detail} \n${region} \n${territory}`);
    } else if (region) {
      setQuery(`${region} \n${territory}`);
    } else {
      setQuery(territory);
    }
  };

  const detectClickOutside = (ref) => {
    useEffect(() => {
      const handler = (event) => {
        if (!visibilityRef.current?.contains(event.target)) {
          setVisibilityOpen(false);
          queryClient.cancelQueries("reports");
        }
      };

      document.addEventListener("mousedown", handler);

      return () => {
        document.removeEventListener("mousedown", handler);
      };
    }, [ref]);
  };

  const visibilityRef = useRef();
  detectClickOutside(visibilityRef);

  return (
    <div className="create">
      <div className="content">
        <div className="write">
          <div className="write-feature">
            <Link to={`/profile/${currentUser.id}`}>
              <img src={currentUser.profilePic} alt="" />
            </Link>
            <TextareaAutosize
              placeholder="That joruney was..."
              {...register("desc")}
            />
          </div>
          {errors.desc && (
            <div className="write-error">
              <MdError /> <p>{errors.desc.message}</p>
            </div>
          )}
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
                    className={!selectedLocation ? "border" : ""}
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
                      {selectedLocation && (
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
          {data && !selectedLocation && (
            <div className="search-result">
              {data &&
                data.map(({ customDisplayName, ...other }, key) => (
                  <Address
                    key={key}
                    customDisplayName={customDisplayName}
                    other={other}
                    handleSelectedLocation={handleSelectedLocation}
                  />
                ))}
            </div>
          )}
        </div>
        <div className="last-add-container">
          <div className="add-photos">
            {file ? (
              <div className="uploaded">
                <img src={URL.createObjectURL(file)} />
                <span className="cancel-background"></span>
                <MdCancel onClick={() => setFile(null)} />
              </div>
            ) : (
              <div className="upload">
                <MdOutlineInsertPhoto />
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    e.target.value = null;
                  }}
                />
                <label htmlFor="file">
                  <p>
                    <span>Add Media</span>
                  </p>
                </label>
              </div>
            )}
          </div>
          <div className="buttons">
            <button
              className="visibility"
              onClick={() => setVisibilityOpen(true)}
            >
              {isPrivate ? (
                <>
                  <HiLockClosed />
                  Private
                </>
              ) : (
                <>
                  <MdOutlinePublic />
                  Public
                </>
              )}
            </button>
            {visibilityOpen && (
              <div className="options" ref={visibilityRef}>
                <p
                  onClick={() => {
                    setIsPrivate(false);
                    setVisibilityOpen(false);
                  }}
                >
                  {isPrivate ? (
                    <>
                      <MdOutlinePublic />
                      Public
                    </>
                  ) : (
                    <span>
                      <MdOutlinePublic />
                      Public
                    </span>
                  )}
                </p>
                <p
                  onClick={() => {
                    setIsPrivate(true);
                    setVisibilityOpen(false);
                  }}
                >
                  {!isPrivate ? (
                    <>
                      <BiLockAlt />
                      Private
                    </>
                  ) : (
                    <span>
                      <HiLockClosed />
                      Private
                    </span>
                  )}
                </p>
              </div>
            )}
            <button
              className="publish"
              onClick={handleSubmit(handleClick)}
              disabled={!watch("desc")}
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
