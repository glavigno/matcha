// Libraries
const router = require("express").Router();
const {
  loadSuggestedProfiles,
  loadUserProfile
} = require("../controllers/profiles");
const verify = require("../middlewares/verifyToken");

// Routing
router.route("/").get(verify, (req, res) => {
  loadSuggestedProfiles(req, res);
});

router.route("/matcher").get(verify, (req, res) => {
  loadSuggestedProfiles(req, res);
});

router.route("/:id").get(verify, (req, res) => {
  loadUserProfile(req, res);
});

module.exports = router;
