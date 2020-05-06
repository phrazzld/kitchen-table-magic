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
const rooms = {};


const addClient = (socket_id) => {
  clients.push({ socket_id });
};

const findClient = (socket_id) => {
  return clients.findIndex((c) => c.socket_id === socket_id);
};

const setRoom = (socket_id, room) => {
  const client = clients[findClient(socket_id)]
  client.room = room;
  if(!rooms[room]) rooms[room] = {};
  rooms[room][client.socket_id]=client;
};

const setEmail = (socket_id, email) => {
  clients[findClient(socket_id)].email = email;
};

const disconnectClient = (socket_id, room) => {
  clients.splice(findClient(socket_id), 1);
  if(rooms[room] && rooms[room][socket_id]){
    delete rooms[room][socket_id];
  }
};

const setDeck = (socket_id, deck) => {
  clients[findClient(socket_id)].deck = deck;
}

const fetchDecks = (room) => {
  let usersInRoom = Object.keys(rooms[room]);
  let decks = usersInRoom.map((user) => { return {deck: rooms[room][user].deck, email: rooms[room][user].email}});
  return decks;
}


io.on("connection", (socket) => {
  if (findClient(socket.id) === -1) {
    addClient(socket.id);
  }

  socket.on("join", (room, email) => {
    socket.leave(socket.room);
    socket.join(room);
    socket.room = room;
    setRoom(socket.id, room);
    setEmail(socket.id, email);
    socket.email = email;
    const emails = Object.keys(rooms[room]).map((clientId) => rooms[room][clientId].email);
    const decks = fetchDecks(room);
    io.in(room).emit("usersConnected", emails, decks);
  });

  socket.on("shareDeck", (room, deck) => {
    setDeck(socket.id, deck);
    const decks = fetchDecks(room);
    socket.to(room).emit("refreshDecks", decks);
  });

  socket.on("disconnect", () => {
    socket.broadcast.to(socket.room).emit("userDisconnected", socket.email);
    disconnectClient(socket.id, socket.room);
    socket.disconnect();
  });
});

http.listen(port, () => {
  console.log("port 8080 enlisted to serve");
});
