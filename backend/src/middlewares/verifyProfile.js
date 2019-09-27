module.exports = async (req, res, next) => {
  if (req.user.id) {
    next();
  } else {
    res.sendStatus(403);
  }
};
