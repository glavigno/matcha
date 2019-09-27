import moment from "moment";

const deg2rad = deg => {
  return deg * (Math.PI / 180);
};

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
};

export const filterProfiles = (profiles, ProfileSettings, user) => {
  const userAge = moment().diff(user.age, "years", false);
  const sortFn = {
    ageAsc: (a, b) =>
      moment().diff(a.age, "years", false) -
      moment().diff(b.age, "years", false),
    ageDesc: (a, b) =>
      moment().diff(b.age, "years", false) -
      moment().diff(a.age, "years", false),
    perimeterAsc: (a, b) =>
      getDistanceFromLatLonInKm(
        user.latitude,
        user.longitude,
        a.latitude,
        a.longitude
      ) -
      getDistanceFromLatLonInKm(
        user.latitude,
        user.longitude,
        b.latitude,
        b.longitude
      ),
    perimeterDesc: (a, b) =>
      getDistanceFromLatLonInKm(
        user.latitude,
        user.longitude,
        b.latitude,
        b.longitude
      ) -
      getDistanceFromLatLonInKm(
        user.latitude,
        user.longitude,
        a.latitude,
        a.longitude
      ),
    popularityAsc: (a, b) => a.score - b.score,
    popularityDesc: (a, b) => b.score - a.score,
    tagsSort: (a, b) =>
      user.tags.filter(value => -1 !== b.tags.indexOf(value)).length -
      user.tags.filter(value => -1 !== a.tags.indexOf(value)).length
  };

  if (ProfileSettings.age && ProfileSettings.popularity) {
    return profiles
      .filter(profile => {
        const profileAge = moment().diff(profile.age, "years", false);
        return (
          profileAge >= ProfileSettings.age[0] &&
          profileAge <= ProfileSettings.age[1] &&
          userAge >= profile.minage &&
          userAge <= profile.maxage &&
          profile.score >= ProfileSettings.popularity[0] &&
          profile.score <= ProfileSettings.popularity[1] &&
          profile.hasblocked === false &&
          getDistanceFromLatLonInKm(
            user.latitude,
            user.longitude,
            profile.latitude,
            profile.longitude
          ) <= ProfileSettings.perimeter &&
          (!ProfileSettings.tags.length
            ? true
            : ProfileSettings.tags.some(e => profile.tags.includes(e)))
        );
      })
      .sort(sortFn[ProfileSettings.sortFn]);
  }
};
