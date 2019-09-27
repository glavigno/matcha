const jwt = require("jsonwebtoken");

module.exports = async function(req, res, next) {
  const token = req.header("token");

  if (!token || token === "") {
    res.status(401).send("Access denied");
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = verified;
    return next();
  } catch (e) {
    res.status(400).send("Invalid token");
  }
};
