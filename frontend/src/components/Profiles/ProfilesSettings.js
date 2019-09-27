// Libraires
import React, { useContext, useEffect, useState } from "react";
import { Icon, Select, Slider } from "antd";

// Import components and css
import "./ProfilesSettings.css";
import "antd/dist/antd.css";

import AuthContext from "../context/authContext";

import Tags from "./ProfilesTags";
const { Option } = Select;

const ProfilesSettings = props => {
  /* ------CONTEXT USE --------------------------------------------------------------------- */
  const context = useContext(AuthContext);
  const [filters, setFilters] = useState({
    minage: context.user.minage,
    maxage: context.user.maxage,
    perimeter: context.user.perimeter,
    sortFn: "ageAsc"
  });

  useEffect(() => {
    let isSet = true;
    const { minage, maxage, perimeter } = context.user;
    if (isSet) {
      setFilters(() => ({
        minage: minage,
        maxage: maxage,
        perimeter: perimeter,
        sortFn: "ageAsc"
      }));
    }
    return () => (isSet = false);
  }, [context.user]);

  const handleAge = e => {
    props.onInputChange(["age", e]);
  };
  const handlePopularity = e => {
    props.onInputChange(["popularity", e]);
  };
  const handlePerimeter = e => {
    props.onInputChange(["perimeter", e]);
  };
  const handleTags = e => {
    props.onInputChange(["tags", e]);
  };
  const handleSort = e => {
    props.onInputChange(["sortFn", e]);
  };

  return (
    <div className="profiles-filters">
      <div className="pf-elem">
        <h1>Age</h1>
        <Slider
          className="block__slider"
          min={18}
          range
          defaultValue={[filters.minage, filters.maxage]}
          onAfterChange={handleAge}
        />
      </div>
      <div className="pf-elem">
        <h1>Popularity Index</h1>
        <Slider
          className="block__slider"
          min={0}
          max={1000}
          range
          defaultValue={[0, 1000]}
          onAfterChange={handlePopularity}
        />
      </div>
      <div className="pf-elem">
        <h1>Search perimeter (in km)</h1>
        <Slider
          max={1000}
          className="block__slider"
          defaultValue={filters.perimeter}
          onAfterChange={handlePerimeter}
          step={50}
        />
      </div>
      <div className="pf-elem">
        <h1>Tags</h1>
        <Tags onChange={handleTags} />
      </div>
      <div className="pf-elem">
        <h1>Sort by</h1>
        <Select
          defaultValue="..."
          style={{ width: "50%" }}
          onChange={handleSort}
        >
          <Option value="ageAsc">
            Age <Icon type="caret-up" />
          </Option>
          <Option value="ageDesc">
            Age <Icon type="caret-down" />
          </Option>
          <Option value="perimeterAsc">
            Perimeter <Icon type="caret-up" />
          </Option>
          <Option value="perimeterDesc">
            Perimeter <Icon type="caret-down" />
          </Option>
          <Option value="popularityAsc">
            Popularity <Icon type="caret-up" />
          </Option>
          <Option value="popularityDesc">
            Popularity <Icon type="caret-down" />
          </Option>
          <Option value="tagsSort">Tags</Option>
        </Select>
      </div>
    </div>
  );
};

export default ProfilesSettings;
