// Libraries
const router = require("express").Router();
const verify = require("../middlewares/verifyToken");
const profile = require("../middlewares/verifyProfile");
const { saveSettings, getSettings } = require("../controllers/settings");

// Routing
router
  .route("/")
  .get(verify, profile, (req, res) => {
    getSettings(req, res);
  })
  .post(verify, (req, res) => {
    saveSettings(req, res);
  });

module.exports = router;
