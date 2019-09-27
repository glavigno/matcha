const User = require("../models/user");

async function getNotification(req, res) {
  const id = req.headers.id;
  const ret = await User.getNotification(id);
  res.status(200).json(ret);
}

async function readNotification(req, res) {
  const id = req.headers.id;
  await User.readNotification(id);
  res.status(200).json();
}

async function getUnreadNotification(req, res) {
  const id = req.headers.id;
  const ret = await User.getUnreadNotification(id);
  res.status(200).json(ret);
}

async function saveNotification(req, res) {
  await User.saveNotification(req, res);
  res.status(200).json();
}

async function updateUserScore(req, res) {
  const { type, visited } = req.body;
  let { score } = req.body;
  if (type === 1) score += 15;
  else if (type === 2) score += 5;
  else if (type === 3) score += 10;
  else if (type === 4) score -= 10;
  else if (type === 5) score -= 20;
  else if (type === 6) score -= 30;

  if (score <= 0) score = 0;
  else if (score >= 1000) score = 1000;
  await User.updateUserScore(visited, score);
  res.status(200).json();
}

module.exports = {
  getNotification,
  saveNotification,
  getUnreadNotification,
  readNotification,
  updateUserScore
};
