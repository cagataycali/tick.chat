const io = require('socket.io')()
const userify = require('userify')
const geoip = require('geoip-lite')

// io.origins(['*'])
io.serveClient(false)
io.sockets.setMaxListeners(0)

let users = []

const createUser = (obj) => {
  users.push(obj)
  return obj
}

io.on('connection', async (socket) => {
  let ip = socket.request.headers['cf-connecting-ip']
  let country = socket.request.headers['cf-ipcountry'] || 'TR'
  let [lat, lng] = [39, 32]

  if (ip) {
    var geo = geoip.lookup(ip)
    lat = geo.ll[0]
    lng = geo.ll[1]
    country = geo.country
  }
  socket.join(country)

  const findOrCreate = (id) => users.find(user => user.id === id) || createUser({ username: userify(), id: socket.id, position: { lat, lng }, data: '', country })

  io.to(socket.id).emit('user_credentials', findOrCreate(socket.id))
  io.to(socket.id).emit('users', users)

  socket.on('myLocation', (location) => {
    let user = findOrCreate(socket.id)
    user.position.lat = location.lat
    user.position.lng = location.lng
    socket.broadcast.emit('location', user)
  })

  socket.on('joinConversation', (to) => {
    let me = findOrCreate(socket.id)
    io.to(to.id).emit('join', me)
  })

  socket.on('message', (message) => {
    if (message.isTrend) {
      let { name, text, date, isTrend, to } = message
      io.to(message.country).emit('message', { name, text, date, isTrend, to })
    } else {
      io.to(message.to).emit('message', message)
    }
  })

  socket.on('spread', (obj) => {
    let user = findOrCreate(socket.id)
    user.data = obj.data
    let { id, username } = user
    io.to(obj.country).emit('spread', { id, name: username, username: username, day: obj.data })
  })

  socket.on('disconnect', function () {
    console.log('user disconnected')
    users = users.filter(user => user.id !== socket.id)
    socket.broadcast.emit('disconnected', { id: socket.id })
  })
})

io.listen(process.env.PORT || 3000)
