const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const passport = require("./auth.js");
const session = require("express-session");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/kitchen-table-magic";
mongoose.connect(MONGODB_URI);
const db = mongoose.connection;
db.on("error", () => console.error("connection error."));
db.once("open", () => {
  console.log("mongodb online.");
});

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "beese churger",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const userRouter = require("./routers/userRouter.js");

app.use("/", userRouter);

const clients = [];

const addClient = (socket_id) => {
  clients.push({ socket_id });
};

const findClient = (socket_id) => {
  return clients.findIndex((c) => c.socket_id === socket_id);
};

const setRoom = (socket_id, room) => {
  clients[findClient(socket_id)].room = room;
};

const setEmail = (socket_id, email) => {
  clients[findClient(socket_id)].email = email;
};

const disconnectClient = (socket_id) => {
  clients.splice(findClient(socket_id), 1);
};

io.on("connection", (socket) => {
  console.log("a user connected");
  if (findClient(socket.id) === -1) {
    addClient(socket.id);
  }

  socket.on("join", (room, email) => {
    socket.leave(socket.room);
    socket.join(room);
    socket.room = room;
    setRoom(socket.id, room);
    setEmail(socket.id, email);
    console.log(clients);
    console.log(`joining lobby with id: ${room}`);
    socket.email = email;
    socket.broadcast.to(room).emit("user_connected", socket.email);
  });

  socket.on("pingRoom", (room) => {
    console.log(`${socket.email} pinging`);
    socket.to(room).emit("pong_user", socket.id);
  });

  socket.on("pongUser", (userId) => {
    console.log(`${socket.email} ponging`);
    io.to(userId).emit("user_connected", socket.email);
  });

  socket.on("disconnect", () => {
    socket.broadcast.to(socket.room).emit("user_disconnected", socket.email);
    disconnectClient(socket.id);
  });
});

http.listen(port, () => {
  console.log("port 8080 enlisted to serve");
});
