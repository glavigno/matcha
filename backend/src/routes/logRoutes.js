// Libraries
const router = require("express").Router();
const { logUser, logUserOut } = require("../controllers/log");

// Routing
router.route("/in").post((req, res) => {
  logUser(req, res);
});

router.route("/out").get((req, res) => {
  logUserOut(req, res);
});

module.exports = router;
