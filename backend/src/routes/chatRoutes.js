// Libraries
const router = require("express").Router();
const {
  readConv,
  getConvs,
  saveMsg,
  getMessagesByMatchId,
  getNbUnread
} = require("../controllers/chats");
const verify = require("../middlewares/verifyToken");

// Routing
router.route("/convs").get((req, res) => {
  getConvs(req, res);
});

router.route("/savemessage").post((req, res) => {
  saveMsg(req, res);
});

router.route("/getmessages").get((req, res) => {
  getMessagesByMatchId(req, res);
});

router.route("/unread").get((req, res) => {
  getNbUnread(req, res);
});

router.route("/readconv").get((req, res) => {
  readConv(req, res);
});

module.exports = router;
