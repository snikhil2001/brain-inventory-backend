const express = require("express");
require("dotenv").config();
const connect = require("./config/db");
const cors = require("cors");
const PORT = process.env.PORT || 5050;

const authRouter = require("./auth/auth.routes");
const passport = require("passport");
const session = require("express-session");

const app = express();
const http = require("http").Server(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/auth", authRouter);
app.use(session());

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socketIO.on("connection", (socket) => {
  console.log(` ${socket.id} user just connected!`);

  socket.on("message", (data) => {
    socketIO.emit("messageResponse", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.get("/", (req, res) => {
  return res.send("hello");
});

http.listen(PORT, async () => {
  await connect();
  console.log(`listening on port ${PORT}`);
});
