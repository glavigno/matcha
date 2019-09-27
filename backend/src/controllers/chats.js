const Match = require("../models/match");
const Chat = require("../models/chat");

const getConvs = async (req, res) => {
  const data = req.header("user");
  const userId = await JSON.parse(data);
  const ret = await Match.getMatchesByIdUser(userId);
  if (ret) {
    return res.status(200).json(ret);
  } else {
    return res.status(400).json({ text: "Error setting match" });
  }
};

const saveMsg = async (req, res) => {
  const ret = await Chat.saveMsg(req.body);
  if (ret) {
    return res.status(200).json(ret);
  } else {
    return res.status(400).json({ text: "Error saving message" });
  }
};

const getMessagesByMatchId = async (req, res) => {
  let ret = { match: {}, messages: [] };
  const data1 = req.header("match_id");
  const data2 = req.header("reader");
  const matchId = await JSON.parse(data1);
  const reader = await JSON.parse(data2);
  const match = await Match.getMatch(matchId);
  const messages = await Chat.getMessagesByMatchId(matchId);
  const read = await Chat.readConv(matchId, reader);
  ret.match = match;
  ret.messages = messages;
  if (match && read) {
    return res.status(200).json(ret);
  } else {
    return res.status(400).json({ text: "Error saving message" });
  }
};

const getNbUnread = async (req, res) => {
  const data = req.header("id");
  const userId = await JSON.parse(data);
  const ret = await Chat.getNbUnread(userId);
  if (ret) {
    return res.status(200).json(ret);
  } else {
    return res.status(400).json({ text: "Error saving message" });
  }
};

const readConv = async (req, res) => {
  const data1 = req.header("match_id");
  const data2 = req.header("user");
  const matchId = await JSON.parse(data1);
  const reader = await JSON.parse(data2);
  const ret = await Chat.readConv(matchId, reader);
  if (ret) {
    return res.status(200).json(ret);
  } else {
    return res.status(400).json({ text: "Error saving message" });
  }
};

module.exports = {
  getConvs,
  saveMsg,
  getMessagesByMatchId,
  getNbUnread,
  readConv
};
