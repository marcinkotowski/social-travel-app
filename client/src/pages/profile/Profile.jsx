import React, { useEffect } from "react";
import "./profile.scss";
import Avatar from "../../assets/avatar2.jpg";
import { IoIosSettings } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";
import Posts from "../../components/posts/Posts";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

const Profile = () => {
  const [typePost, setTypePost] = useState("public");

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
      <div className="profile">
        <div className="user-information">
          {/* <div className="map"> */}
          <MapContainer center={[20, 0]} zoom={1} scrollWheelZoom={true}>
            <TileLayer
              /* Default */
              // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              /* Esri.WorldStreetMap */
              attribution="Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              position={"topright"}
            />
            <Marker
              position={[51.82598741029167, 17.454792240792532]}
              icon={myIcon}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
          {/* <img
              src="https://www.google.com/maps/d/u/0/thumbnail?mid=1oisvAcXvhO6Un_cgYOjMHWsdUjY&hl=en_US"
              alt=""
            /> */}
          {/* </div> */}
          <div className="user-details">
            <div className="top">
              <div className="user-avatar">
                <img src={Avatar} alt="" />
              </div>
            </div>
            <div className="bottom">
              <div className="names">
                <p className="full-name">Jarek Tadlesusszowskis</p>
                <p className="username">@marcinkotowski</p>
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
                  <FaMapMarkerAlt />
                  <p>
                    Journeys: <span>12</span>
                  </p>
                </div>
              </div>
              <div className="action">
                <button>Follow</button>
              </div>
            </div>
          </div>
        </div>
        <div className="archives">
          <div className="type-post">
            <p
              className={typePost === "public" ? "active" : ""}
              onClick={() => setTypePost("public")}
            >
              Public
            </p>
            <p
              className={typePost === "private" ? "active" : ""}
              onClick={() => setTypePost("private")}
            >
              Private
            </p>
          </div>
          {/* <Posts typePost={typePost} /> */}
          <Posts />
        </div>
      </div>
    </div>
  );
};

export default Profile;
