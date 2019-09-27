// Libraires
import React, { useState, useEffect, useContext } from "react";

// Import components and css
import "./Profiles.css";
import ProfilesSettings from "./ProfilesSettings";
import PaginationProfiles from "./PaginationProfiles";
import { filterProfiles } from "./profilesUtils";

import AuthContext from "../context/authContext";
import SocketContext from "../context/socketContext";

import { Icon } from "antd";
import info from "../../assets/static/svg/info.svg";

function Profiles(props) {
  /* ------CONTEXT USE --------------------------------------------------------------------- */

  const context = useContext(AuthContext);
  const socketContext = useContext(SocketContext);

  /* ------STATE VARIABLES---------------------------------------------------------------- */

  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [ProfileSettings, setProfileSettings] = useState({});
  const [loading, setLoading] = useState(true);

  /* ------FETCH PROFILES FROM DB -------------------------------------------------------- */

  useEffect(() => {
    let isSet = true;
    const fetchProfiles = async () => {
      const res = await fetch(`/profiles`, {
        headers: { token: context.token, user: context.user.id }
      });
      try {
        if (res) {
          if (isSet) {
            if (res.status === 200) {
              setLoading(false);
              let profiles = await res.json();
              setProfiles([...profiles]);
              setFilteredProfiles(
                filterProfiles(profiles, ProfileSettings, context.user)
              );
            } else {
              props.history.push("/");
              setLoading(false);
              context.logout();
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfiles();
    return () => (isSet = false);
  }, [context, ProfileSettings, props.history]);

  useEffect(() => {
    let isSet = true;
    if (isSet) {
      setProfileSettings({
        age: [context.user.minage, context.user.maxage],
        popularity: [0, 1000],
        perimeter: context.user.perimeter,
        tags: [],
        sortFn: "ageAsc"
      });
    }
    return () => (isSet = false);
  }, [context.user]);

  useEffect(() => {
    let isSet = true;
    if (isSet) {
      setFilteredProfiles(
        filterProfiles(profiles, ProfileSettings, context.user)
      );
    }
    return () => (isSet = false);
  }, [ProfileSettings, context.user, profiles]);

  socketContext.on("likeUser", (likedUserId, interested, userId) => {
    if (filteredProfiles) {
      setFilteredProfiles(
        filteredProfiles.map(e => {
          if (e.id === userId) {
            return { ...e, isliked: interested ? true : false };
          } else return e;
        })
      );
    }
  });

  /* ------HANDLE INTERACTION------------------------------------------------------------- */

  const handleChange = data => {
    const [key, value] = data;
    setProfileSettings(ProfileSettings => ({
      ...ProfileSettings,
      [key]: value
    }));
  };

  if (loading) return <Icon type="loading" style={{ fontSize: 48 }} spin />;
  else if (!loading && context.user.is_complete) {
    return (
      <div className="profiles-container">
        <ProfilesSettings onInputChange={handleChange} />
        <PaginationProfiles
          profiles={filteredProfiles}
          settings={ProfileSettings}
        />
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img src={info} alt=""></img>
        <h1>You must complete your profile info</h1>
      </div>
    );
  }
}

export default Profiles;
