// Libraries
const router = require("express").Router();
const { validateUser } = require("../controllers/registration");

// Routing
router.route("/").post((req, res) => {
  validateUser(req, res);
});

module.exports = router;
