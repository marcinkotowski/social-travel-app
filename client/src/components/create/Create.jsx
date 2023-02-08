import React, { useCallback, useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import TextareaAutosize from "react-textarea-autosize";
import "./create.scss";
import {
  MdAddLocationAlt,
  MdOutlineInsertPhoto,
  MdOpenInNew,
  MdDelete,
  MdEdit,
  MdError,
} from "react-icons/md";
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

const Create = () => {
  const [addLocation, setAddLocation] = useState(false);
  const [query, setQuery] = useState("");
  const [searchingDebounce, setSearchingDebounce] = useState(false);
  const [data, setData] = useState("");
  const [selectedlocation, setSelectedlocation] = useState("");
  const [anonymousLocation, setAnonymousLocation] = useState(false);
  const [file, setFile] = useState(null);

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
    setSelectedlocation("");
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
      mutation.mutate({ desc, img: imgUrl, selectedlocation });
      reset({
        desc: "",
      });
      setFile(null);
      setQuery("");
      setData("");
      setSelectedlocation("");
      setAnonymousLocation(false);
      setAddLocation(false);
    } catch (err) {
      setError("desc", { type: "custom", message: err.response.data });
    }
  };

  const handleSearch = useCallback(
    debounce((query) => {
      if (query.length > 0) {
        axios
          .get(
            `https://nominatim.openstreetmap.org/search?q=${query}&addressdetails=1&format=json&limit=6&accept-language=en-US`
            // accept-language=pl
          )
          .then((res) => {
            res = res.data;

            /* Remove redundant properties */
            res = res.map(({ lat, lon, display_name, address }) => {
              const {
                amenity,
                building,
                road,
                house_number,
                postcode,
                city,
                town,
                administrative,
                natural,
                place,
                village,
                hamlet,
                county,
                state,
                country,
              } = address;

              let detail = [];
              let region = [];
              let territory = [];

              detail.push(amenity, building, road, house_number);
              region.push(
                postcode,
                city,
                town,
                administrative,
                natural,
                place,
                village,
                hamlet
              );
              territory.push(county, state, country);

              detail = detail.filter((element) => element !== undefined);
              region = region.filter((element) => element !== undefined);
              territory = territory.filter((element) => element !== undefined);

              detail = detail.join(" ");
              region = region.join(" ");
              territory = territory.join(" ");

              const customDisplayName = {
                detail,
                region,
                territory,
              };

              return { lat, lon, display_name, address, customDisplayName };
            });

            /* Remove all duplicates from an array of response */
            res = res.filter(
              (curr, index, self) =>
                index ===
                self.findIndex(
                  (location) => location.display_name === curr.display_name
                )
            );

            setData(res);
            console.log(res);
          });
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

  const handleSelectedLocation = ({ customDisplayName, ...other }) => {
    const { lat, lon, address } = other.other;

    setSelectedlocation({
      lat,
      lon,
      customDisplayName,
      address,
    });

    const { detail, region, territory } = customDisplayName;

    if (detail) {
      setQuery(`${detail}\n${region}\n${territory}`);
    } else if (region) {
      setQuery(`${region}\n${territory}`);
    } else {
      setQuery(territory);
    }
  };

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
                </span>
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
                data.map(({ customDisplayName, ...other }) => (
                  <p
                    key={customDisplayName.key}
                    onClick={() =>
                      handleSelectedLocation({ customDisplayName, other })
                    }
                  >
                    {customDisplayName.detail ? (
                      <>
                        {customDisplayName.detail}
                        <br />
                        {customDisplayName.territory && (
                          <span>
                            {customDisplayName.territory}
                            <br />
                          </span>
                        )}
                        {customDisplayName.region && (
                          <span>
                            {customDisplayName.region}
                            <br />
                          </span>
                        )}
                      </>
                    ) : customDisplayName.region ? (
                      <>
                        {customDisplayName.region && (
                          <>
                            {customDisplayName.region}
                            <br />
                          </>
                        )}
                        {customDisplayName.territory && (
                          <span>
                            {customDisplayName.territory}
                            <br />
                          </span>
                        )}
                      </>
                    ) : (
                      <>{customDisplayName.territory}</>
                    )}
                  </p>
                ))}
            </div>
          )}
        </div>
        <div className="add-photos">
          {!file && <MdOutlineInsertPhoto />}
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={(e) => {
              setFile(e.target.files[0]);
              e.target.value = null;
            }}
          />
          {file && <img src={URL.createObjectURL(file)} />}
          <label htmlFor="file">
            <p>
              <span>{file ? <MdEdit /> : "Add Media"}</span>
            </p>
          </label>
          <span>{file && <MdDelete onClick={() => setFile(null)} />}</span>
          <button onClick={handleSubmit(handleClick)} disabled={!watch("desc")}>
            Publish
          </button>
        </div>

        {/* <hr /> */}
      </div>
    </div>
  );
};

export default Create;
