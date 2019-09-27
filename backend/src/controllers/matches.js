const Match = require("../models/match");
const Chat = require("../models/chat");

const setMatch = async (req, res) => {
  const data = req.header("props");
  const obj = await JSON.parse(data);
  const ret1 =
    obj.interested === 1
      ? null
      : await Chat.delConvByIdUsers(obj.likedUser, obj.user);
  const ret2 =
    obj.interested === 1
      ? await Match.setMatch(obj)
      : await Match.delMatch(obj);
  if (ret2) {
    return res.status(200).json(data);
  } else {
    return res.status(400).json({ text: "Error setting match" });
  }
};

module.exports = {
  setMatch
};
