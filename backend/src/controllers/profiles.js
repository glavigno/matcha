const User = require("../models/user");

async function loadProfiles(req, res) {
  const ret = await User.getUserId(req.user);
  if (ret) {
    const data = await User.getUsers();
    return res.status(200).json(data);
  } else {
    return res.status(400).json({ text: "Invalid user" });
  }
}

async function loadUserProfile(req, res) {
  const ret = await User.getOneUser(req.params.id, req.header("currentUserId"));
  const canAcess = await User.getBlockStatus(
    req.params.id,
    req.header("currentUserId")
  );
  if (ret !== undefined && !canAcess) {
    return res.status(200).json(ret);
  } else {
    return res.status(400).json({ text: "Invalid user" });
  }
}

async function loadSuggestedProfiles(req, res) {
  const currentUser = await User.getUserInfo(req.headers.user);
  let orientation_req = currentUser.orientation == 2 ? 2 : 1;
  let ret = await User.getSuggestedProfiles(
    orientation_req,
    currentUser.orientation == 3 ? 1 : 0,
    currentUser.gender,
    currentUser.id
  );
  if (ret) {
    return res.status(200).json(ret);
  } else {
    return res.status(400).json({ error: "error" });
  }
}

module.exports = {
  loadProfiles,
  loadUserProfile,
  loadSuggestedProfiles
};
