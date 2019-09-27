const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../utils/mail");

const emailChecker = email => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
};

const pwdChecker = password => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(password);
};

const updateUserInfo = async (req, res) => {
  const { id, firstname, lastname, login, password, email } = req.body;

  let ret = false;
  if (firstname !== "" && firstname !== undefined) {
    ret = await User.updateUserInfo(id, "firstname", firstname);
  }
  if (lastname !== "" && lastname !== undefined) {
    ret = await User.updateUserInfo(id, "lastname", lastname);
  }
  if (login !== "" && login !== undefined) {
    ret = await User.updateUserInfo(id, "login", login);
  }
  if (password !== undefined && pwdChecker(password)) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    ret = await User.updateUserInfo(id, "password", hashedPassword).catch(e =>
      console.log("Error")
    );
  }
  if (email !== undefined && emailChecker(email)) {
    ret = awaitUser.updateUserInfo(id, "email", email);
  }
  if (!ret) return res.sendStatus(400);
  return res.status(200).json();
};

const forgotUserPassword = async (req, res) => {
  const { email } = req.body;
  const key = await User.getUserPrivateKey(email);
  sendMail(email, 1, key);
  res.status(200).json();
};

const resetUserPassword = async (req, res) => {
  const { password, confirmation, key } = req.body;
  if (password === confirmation && pwdChecker(password)) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.resetUserPassword(hashedPassword, key);
    res.status(200).json();
  }
  res.status(400).json();
};

const reportUser = async (req, res) => {
  const { reporterUserId, reportedUserId } = req.body;
  const ret = await User.hasReported(reporterUserId, reportedUserId);
  if (!ret) await User.reportUser(reporterUserId, reportedUserId);
  res.status(200).json();
};

const blockUser = async (req, res) => {
  const { blockerUserId, blockedUserId } = req.body;
  await User.blockUser(blockerUserId, blockedUserId);
  res.status(200).json();
};

module.exports = {
  updateUserInfo,
  forgotUserPassword,
  resetUserPassword,
  reportUser,
  blockUser
};
