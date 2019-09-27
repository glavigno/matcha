// Libraries
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();

// Require route files
const loginRoutes = require("./src/routes/logRoutes");
const authRoutes = require("./src/routes/authRoutes");
const registrationRoutes = require("./src/routes/registrationRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const likeRoutes = require("./src/routes/likeRoutes");
const settingsRoutes = require("./src/routes/settingsRoutes");
const notificationRoutes = require("./src/routes/noficationRoutes");
const securityRoutes = require("./src/routes/securityRoutes");
const matchRoutes = require("./src/routes/matchRoutes");
const chatRoutes = require("./src/routes/chatRoutes");

// Server configuration
const port = 6200;

server.listen(port, () => {
  console.log("Backend running on port: ", port);
});

// Socket.io
io.on("connect", socket => {
  socket.join(socket.handshake.query.userId);
  socket.broadcast.emit("logUser", socket.handshake.query.userId);
  socket.on("profileVisit", (visitedId, visitorId) => {
    if (visitedId !== parseInt(socket.handshake.query.userId))
      io.to(visitedId).emit("profileVisit", visitorId);
  });
  socket.on("likeUser", (likedUserId, interest, userId) => {
    io.to(likedUserId).emit("likeUser", likedUserId, interest, userId);
  });
  socket.on("createChatroom", data => {
    socket.join(data);
  });
  socket.on("quitChatroom", data => {
    socket.leave(data);
  });
  socket.on("message_send", data => {
    socket.to(data.roomId).emit("message_receive", data);
    io.to(data.receiver).emit("message-notif", data);
    io.to(data.sender).emit("message-notif", data);
  });
  socket.on("match", (likedUserId, UserId) => {
    io.to(likedUserId).emit("match", UserId);
    io.to(UserId).emit("match", UserId);
  });
  socket.on("disconnect", () => {
    const keys = Object.keys(io.sockets.connected);
    const newArr = keys.map(
      key =>
        io.sockets.connected[key].handshake.query.userId ===
        socket.handshake.query.userId
    );
    socket.broadcast.emit(
      "logOutUser",
      socket.handshake.query.userId,
      newArr.length
    );
    socket.disconnect();
  });
});

// Use packages
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(bodyParser.json({ limit: "5mb" }));

// Routes middlewares
app.use("/log", loginRoutes);
app.use("/auth", authRoutes);
app.use("/like", likeRoutes);
app.use("/profiles", profileRoutes);
app.use("/security", securityRoutes);
app.use("/settings", settingsRoutes);
app.use("/notification", notificationRoutes);
app.use("/registration", registrationRoutes);
app.use("/match", matchRoutes);
app.use("/chat", chatRoutes);

// Catch routing errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
  next(error);
});
