const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const socketRouter = express.Router();

socketRouter.route('/')
  .get((req,res) => {
    res.send('goteem');
  })
  .post((req, res) => {
    res.send(req.body);
  });

app.use('/socket', socketRouter);

app.get('/', (req, res) => {
  res.send('yo');
})


io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat', (message) => {
    socket.broadcast.emit('chat', message);
  });
})

http.listen(port, () => {
  console.log('port 8080 enlisted to serve');
});
