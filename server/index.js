const express = require('express')
const io = require('socket.io')
const logger = require('./logger')
const setup = require('./setup')

const app = express()
const host = process.env.HOST || null
const prettyHost = process.env.HOST || 'localhost'
const port = process.env.HOST || 3000
const socketPort = 3001
var room
var users

app.use(require('helmet')())

setup(app)

app.listen(port, host, err => {
  if (err) return logger.error(err.message)
  return logger.appStarted(port, prettyHost)
})

io.listen(socketPort).on('connect', socket => {
  socket.on('init', callback => {
    if (!room) {
      room = [socket]
      users = 0
      callback(users)
      console.log('Room created')
    } else {
      users++
      callback(users)
      for (let s of room) {
        if (s) s.emit('peer.connected', { id: users })
      }
      room[users] = socket
      console.log('Peer connected as: ', users)
    }
  })

  socket.on('msg', data => {
    var to = parseInt(data.to, 10)
    if (room && room[to]) {
      console.log('msg to ', to, ' by ', data.by)
      room[to].emit('msg', data)
    } else {
      console.log('INVALID USER')
    }
  })

  socket.on('disconnect', () => {
    if (!room) return
    delete room[room.indexOf(socket)]
    for (let s of room) {
      if (s) s.emit('peer.disconnected', { id: users })
    }
  })

  socket.on('check', callback => {
    callback(users)
  })
})
