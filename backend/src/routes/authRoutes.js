// Libraries
const router = require("express").Router();
const jwt = require("jsonwebtoken");

// Routing
router.route("/:token").get((req, res) => {
  try {
    jwt.verify(req.url.split("/")[1], process.env.TOKEN_SECRET_KEY);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(400);
  }
});

module.exports = router;
