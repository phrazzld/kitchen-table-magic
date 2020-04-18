const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const passport = require('./auth.js')
const session = require('express-session');
const validator = require('email-validator');

const User = require('./schemas/User.js');

mongoose.connect('mongodb://localhost:27017/kitchen-table-magic');
const db = mongoose.connection;
db.on('error', () => console.log('connection error.'));
db.once('open', () => {
  console.log('mongodb online.');
})

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'beese churger',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());


const userRouter = express.Router();

userRouter.route('/login')
  .post(passport.authenticate('local', {failureRedirect: '/loggedIn'}),(req,res) => {
    res.send('logged in');
  });

userRouter.route('/register')
  .post(async (req, res) => {
    const { email, password } = req.body;
    if(!validator.validate(email)){
      return res.sendStatus(400);
    }
    const newUser = new User({email, password});
    try {
      const emailInUse = await User.findOne({email: newUser.email}).select('_id').lean();
      if(emailInUse) {
        console.log('user attempted to create account with existing email.');
        return res.sendStatus(401);
      }
      await newUser.save();
      // await passport.authenticate('local');
      console.log(`new user created with email: ${newUser.email}`);
      await passport.authenticate('local');
      await req.logIn(newUser, (err) => {
        if (err) throw err;
      });
      // return false;
      return res.sendStatus(200);
    } catch(err) {
      console.log(err);
      return res.sendStatus(500);
    }
  });

userRouter.route('/loggedIn')
  .get((req, res) => {
    console.log('login attempt')
    if(req.user){
      return res.json({logged_in:true, email: req.user.email});
    }
    return res.json({logged_in:false, email:''});
  });

app.use('/', userRouter);

app.get('/socket.io', (req, res) => {
  res.send('test');
})

const clients = [];
/*
{
  email: test@test.com
  socket_id:  2uhnfadsfj
  room: asdfaksdf
}
*/

const addClient = (socket_id) => {
  clients.push({socket_id});
}

const findClient = (socket_id) => {
  return clients.findIndex((c) => c.socket_id === socket_id);
}

const setRoom = (socket_id, room) => {
  clients[findClient(socket_id)].room = room;
}

const setEmail = (socket_id, email) => {
  clients[findClient(socket_id)].email = email;
}

const disconnectClient = (socket_id) => {
  clients.splice(findClient(socket_id), 1);
}

io.on('connection', (socket) => {
  console.log('a user connected');
  if(findClient(socket.id) === -1) {
    addClient(socket.id);

  }

  socket.on('join', (room, email) => {
    socket.leave(socket.room);
    socket.join(room);
    socket.room = room;
    setRoom(socket.id, room);
    setEmail(socket.id, email);
    console.log(clients);
    console.log(`joining lobby with id: ${room}`);
    socket.email = email;
    socket.broadcast.to(room).emit('user_connected', socket.email);
  });

  socket.on('ping_room', (room) => {
    console.log(`${socket.email} pinging`);
    socket.to(room).emit('pong_user', socket.id);
  });

  socket.on('pong_user', (userId) => {
    console.log(`${socket.email} ponging`);
    io.to(userId).emit('user_connected', socket.email);
  })

  socket.on('disconnect', () => {
      socket.broadcast.to(socket.room).emit('user_disconnected', socket.email);
      disconnectClient(socket.id);
  });

  socket.on('update', (message) => {
    socket.to(socket.room).emit('update', message);
  });

})

http.listen(port, () => {
  console.log('port 8080 enlisted to serve');
});
