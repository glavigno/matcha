const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const logUser = async (req, res) => {
  // Check if an account is linked to the email in the database
  const user = await User.findUser(req.body.email);
  const contextUser = await User.getContextUser(req.body.email);
  if (!user) return res.status(400).json({ message: "Unknown user" });

  // Check if the password matches the hash stored in the database
  const isPasswordOk = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordOk) return res.status(400).json({ message: "Wrong password" });

  if (req.body.key !== undefined) {
    const authUser = await User.keyChecker(req.body.key);
    if (!authUser) return res.status(400).json();
    else await User.validateAccount(req.body.email);
  } else {
    const userStatus = await User.checkUserStatus(req.body.email);
    if (!userStatus) return res.status(400).json();
  }

  // Create and assign a token to the user
  const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET_KEY, {
    expiresIn: "1h"
  });

  await User.connectUser(user.id, true);

  res.status(200).json({
    message: "User logged in",
    user: contextUser,
    token: token,
    tokenExpiration: 1
  });
};

const logUserOut = async (req, res) => {
  await User.connectUser(req.headers.userid, false);
  res.status(200).json();
};

module.exports = { logUser, logUserOut };
