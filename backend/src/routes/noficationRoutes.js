// Libraries
const router = require("express").Router();
const {
  getNotification,
  saveNotification,
  getUnreadNotification,
  readNotification,
  updateUserScore
} = require("../controllers/notification");

// Routing
router
  .route("/")
  .get((req, res) => {
    getNotification(req, res);
  })
  .post((req, res) => {
    saveNotification(req, res);
  });

router.route("/read").get((req, res) => {
  readNotification(req, res);
});

router.route("/unread").get((req, res) => {
  getUnreadNotification(req, res);
});

router.route("/score").post((req, res) => {
  updateUserScore(req, res);
});

module.exports = router;
