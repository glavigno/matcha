// Libraries
const router = require("express").Router();
const { setMatch } = require("../controllers/matches");

// Routing
router.route("/").get((req, res) => {
  setMatch(req, res);
});

module.exports = router;
