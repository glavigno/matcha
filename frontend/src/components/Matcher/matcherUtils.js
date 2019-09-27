import { getDistanceFromLatLonInKm } from "../Profiles/profilesUtils";
import moment from "moment";

export const filterProfiles = (profiles, user) => {
  const userAge = moment().diff(user.age, "years", false);

  const prefilteredProfiles = profiles.filter(profile => {
    const profileAge = moment().diff(profile.age, "years", false);
    return (
      profileAge > user.minage &&
      profileAge < user.maxage &&
      userAge > profile.minage &&
      userAge < profile.maxage &&
      getDistanceFromLatLonInKm(
        user.latitude,
        user.longitude,
        profile.latitude,
        profile.longitude
      ) <= user.perimeter &&
      !profile.hasliked &&
      profile.hasblocked === false
    );
  });
  prefilteredProfiles.push({
    endOfProfiles: "You viewed every profiles that match your personnality :)"
  });
  return prefilteredProfiles;
};
