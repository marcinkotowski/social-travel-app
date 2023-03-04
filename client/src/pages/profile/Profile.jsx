import React, { useContext, useEffect } from "react";
import "./profile.scss";
import Avatar from "../../assets/avatar2.jpg";
import { IoIosSettings } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";
import Posts from "../../components/posts/Posts";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../axios.js";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import MoonLoader from "react-spinners/MoonLoader";
import Address from "../../components/address/Address";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const userId = useLocation().pathname.split("/")[2];

  const { isLoading, error, data } = useQuery(["user", userId], () =>
    makeRequest.get(`/users/find/${userId}`).then((res) => {
      return res.data;
    })
  );

  const {
    isLoading: pinIsLoading,
    error: pinError,
    data: pinData,
  } = useQuery(["pins", userId], () =>
    makeRequest.get(`/pins/${userId}`).then((res) => {
      return res.data;
    })
  );

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship", userId],
    () =>
      makeRequest.get(`/relationships?followedUserId=${userId}`).then((res) => {
        return res.data;
      })
  );

  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete(`/relationships?userId=${userId}`);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries("relationship");
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData?.includes(currentUser.id));
  };

  const myIcon = new Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="background-profile">
      {error ? (
        <p className="error">Something went wrong</p>
      ) : isLoading ? (
        <MoonLoader loading={isLoading} speedMultiplier={0.7} size={30} />
      ) : (
        <div className="profile">
          <div className="user-information">
            {/* <div className="map"> */}
            {pinError ? (
              <p className="error">Something went wrong</p>
            ) : pinIsLoading ? (
              <MoonLoader loading={isLoading} speedMultiplier={0.7} size={30} />
            ) : (
              <MapContainer center={[20, 0]} zoom={1} scrollWheelZoom={false}>
                <TileLayer
                  /* Default */
                  // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  /* Esri.WorldStreetMap */
                  attribution="Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                  position={"topright"}
                />
                {pinData.map(({ lat, lon, customDisplayName }, key) => {
                  customDisplayName = JSON.parse(customDisplayName);
                  return (
                    <Marker position={[lat, lon]} icon={myIcon} key={key}>
                      <Popup>
                        <Address customDisplayName={customDisplayName} />
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            )}
            {/* <img
              src="https://www.google.com/maps/d/u/0/thumbnail?mid=1oisvAcXvhO6Un_cgYOjMHWsdUjY&hl=en_US"
              alt=""
            /> */}
            {/* </div> */}
            <div className="user-details">
              <div className="top">
                <div className="user-avatar">
                  <img src={data.profilePic} alt="" />
                </div>
              </div>
              <div className="bottom">
                <div className="names">
                  <p className="full-name">{data.name}</p>
                  <p className="username">@{data.username}</p>
                </div>
                <div className="statistics">
                  <div className="follow-information">
                    <p className="followers">
                      Followers: <span>123</span>
                    </p>
                    <p className="following">
                      Following: <span>123</span>
                    </p>
                  </div>
                  <div className="journeys">
                    {pinError ? (
                      <p className="error">Something went wrong</p>
                    ) : pinIsLoading ? (
                      <MoonLoader
                        loading={isLoading}
                        speedMultiplier={0.7}
                        size={30}
                      />
                    ) : (
                      <>
                        <FaMapMarkerAlt />
                        <p>
                          Journeys: <span>{pinData.length}</span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="action">
                  {rIsLoading ? (
                    "Loading"
                  ) : userId == currentUser.id ? (
                    <button style={{ backgroundColor: "gray" }}>
                      Settings
                    </button>
                  ) : relationshipData.includes(currentUser.id) ? (
                    <button
                      style={{ backgroundColor: "gray" }}
                      onClick={handleFollow}
                    >
                      Following
                    </button>
                  ) : (
                    <button onClick={handleFollow}>Follow</button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Posts userId={userId} />
        </div>
      )}
    </div>
  );
};

export default Profile;
