// Libraries
const router = require("express").Router();
const { setMatcherLike } = require("../controllers/likes");

// Routing
router.route("/").get((req, res) => {
  setMatcherLike(req, res);
});

module.exports = router;
