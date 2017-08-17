export default (() => {
  let connections = {}
  let stream
  let socket
  let currentId
  let iceServers = [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ]
  return {
    stream,
    socket,
    id: currentId,
    iceServers,
    getConnection: id => connections[id],
    putConnection: (id, pc) => (connections[id] = pc),
    deleteConnection: id => delete connections[id],
  }
})()
