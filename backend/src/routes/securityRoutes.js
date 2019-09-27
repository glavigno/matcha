// Libraries
const router = require("express").Router();
const {
  updateUserInfo,
  forgotUserPassword,
  resetUserPassword,
  reportUser,
  blockUser
} = require("../controllers/security");
const { logUser } = require("../controllers/log");

// Routing
router
  .post("/", (req, res) => {
    updateUserInfo(req, res);
  })
  .post("/forgot", (req, res) => {
    forgotUserPassword(req, res);
  })
  .post("/reset/:key", (req, res) => {
    resetUserPassword(req, res);
  })
  .post("/authentication", (req, res) => {
    logUser(req, res);
  })
  .post("/report", (req, res) => {
    reportUser(req, res);
  })
  .post("/block", (req, res) => {
    blockUser(req, res);
  });

module.exports = router;
