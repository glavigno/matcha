const User = require("../models/user");
const { sendMail } = require("../utils/mail");
const uniqid = require("uniqid");
const moment = require("moment");

const namesChecker = (first, last) => {
  const regex = /^[a-zA-Z]+$/;
  return regex.test(first) && regex.test(last);
};

const emailChecker = email => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
};

const pwdChecker = password => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(password);
};

const validateInputs = async data => {
  const { firstName, lastName, email, password, age } = data;
  const years = moment().diff(age, "years", false);
  if (
    !namesChecker(firstName, lastName) ||
    !emailChecker(email) ||
    !pwdChecker(password) ||
    !(years >= 18 && years <= 100)
  ) {
    return false;
  }
  return true;
};

const validateUser = async (req, res) => {
  // Inputs validation
  const inputs = await validateInputs(req.body);
  if (!inputs) return res.status(400).json({ text: "Invalid inputs" });

  // Is email already in the database
  const mailCheck = await User.userExists(req.body.email);
  if (mailCheck) return res.status(400).json({ text: "User already exists" });

  const key = uniqid();
  // Register new valid user
  await User.registerUser(req.body, key);
  // Send registration email to the user
  sendMail(req.body.email, 0, key);

  res.status(200).json({ text: "User created" });
};

module.exports = { validateUser };
