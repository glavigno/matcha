const User = require("../models/user");

const getSettings = async (req, res) => {
  const data = await User.getUserInfo(req.headers.user);
  res.status(200).json(data);
};

const saveSettings = async (req, res) => {
  const { id, form } = req.body;
  let isValid = true;
  for (let i in form) {
    if (form[i] === undefined || form[i] === "") isValid = false;
    else if (Array.isArray(form[i]) && !form[i].length) isValid = false;
  }
  if (isValid) {
    await User.saveSettings(id, form);
    const data = await User.getOneUser(id);
    res.status(200).json(data);
  } else {
    res.status(400);
  }
};

module.exports = { saveSettings, getSettings };
