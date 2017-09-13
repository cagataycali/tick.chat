var io = require('socket.io')();
var userify = require('userify');
var geoip = require('geoip-lite');

io.origins(['tick.fun:443', 'tick.chat:443']);
io.serveClient(false);

let users = [];

const createUser = (obj) => {
  users.push(obj);
  return obj;
};

io.on('connection', (socket) => {

  let ip = socket.request.headers['cf-connecting-ip'];

  let [lat, lng] = [10, 10];
  if (ip) {
    var geo = geoip.lookup(ip);
    [lat, lng] = geo.ll;
  }

  console.log('User connected from', socket.request.headers['cf-ipcountry'] || 'local');

  const findOrCreate = (id) => users.find(user => user.id === id) || createUser({username: userify(), id: socket.id, position: {lat, lng}, data:''});

  io.to(socket.id).emit('user_credentials', findOrCreate(socket.id));
  io.to(socket.id).emit('users', users);

  socket.on('myLocation', (location) => {
    let user = findOrCreate(socket.id);
    user.position.lat = location.lat
    user.position.lng = location.lng
    socket.broadcast.emit('location', user);
  })

  socket.on('joinConversation', (to) => {
    let me = findOrCreate(socket.id);
    io.to(to.id).emit('join', me);
  })

  socket.on('message', (message) => {
    io.to(message.to).emit('message', message);
  })

  socket.on('spread', (obj) => {
    if (obj.id === socket.id) {
      let user = findOrCreate(socket.id);
      user.data = obj.data
      let {id, username} = user;
      socket.broadcast.emit('spread', {id, name:username, username: username, day:obj.data});
    }
  })

  socket.on('disconnect', function() {
    console.log('user disconnected');
    users = users.filter(user => user.id !== socket.id)
    socket.broadcast.emit('disconnected', {id:socket.id});
  });

});

io.listen(process.env.PORT || 3000);
