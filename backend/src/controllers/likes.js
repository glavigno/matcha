const Like = require("../models/like");

const setMatcherLike = async (req, res) => {
  const data = req.header("props");
  const obj = await JSON.parse(data);
  const ret =
    obj.interested === 1 ? await Like.setLike(obj) : await Like.DelLike(obj);
  if (ret) {
    return res.status(200).json(data);
  } else {
    return res.status(400).json({ text: "Error setting like" });
  }
};

module.exports = {
  setMatcherLike
};
