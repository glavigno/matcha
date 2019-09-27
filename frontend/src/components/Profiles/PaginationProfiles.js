// Libraires
import React, { useState, useEffect } from "react";

import Card from "../Card/Card";
import "./PaginationProfiles.css";
import "./Profiles.css";
import { Icon } from "antd";

const PaginationProfiles = props => {
  /* ------STATE VARIABLES---------------------------------------------------------------- */
  const [pagination, setPagination] = useState({
    currentPage: 1,
    profilesPerPage: 8
  });

  /* ------HANDLE INTERACTION------------------------------------------------------------- */

  const handlePagination = i => {
    const newPage = i ? pagination.currentPage + 1 : pagination.currentPage - 1;
    setPagination(prevState => ({ ...prevState, currentPage: newPage }));
  };

  useEffect(() => {
    let isSet = true;
    if (isSet) setPagination(pagination => ({ ...pagination, currentPage: 1 }));
    return () => (isSet = false);
  }, [props.profiles]);

  /* ------PAGINATION LOGIC----------------------------------------------------------------- */

  const { currentPage, profilesPerPage } = pagination;

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = (props.profiles) ? props.profiles.slice(
    indexOfFirstProfile,
    indexOfLastProfile
  ) : [];

  const renderProfiles = currentProfiles.map(profile => {
    return <Card key={profile.id} item={profile} cardIcon={true} />;
  });

  const pageNumbers = props.profiles ? props.profiles.length / profilesPerPage : 0;

  return (
    <div className="profiles-pagination-container">
      <div className="arrow-left">
        {pagination.currentPage > 1 && (
          <Icon
            type="left"
            style={{ minWidth: "5px", fontSize: "36px" }}
            onClick={() => handlePagination(0, pageNumbers)}
          />
        )}
      </div>

      <div className="profiles">{renderProfiles}</div>
      <div className="arrow-right">
        {pagination.currentPage < pageNumbers && (
          <Icon
            type="right"
            style={{ minWidth: "5px", fontSize: "36px" }}
            onClick={() => handlePagination(1, pageNumbers)}
          />
        )}
      </div>
    </div>
  );
};

export default PaginationProfiles;
