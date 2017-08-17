import io from 'socket.io-client'
import connections from '../utils/connections'

export const ADD_PEER = 'ADD_PEER'
export const REMOVE_PEER = 'REMOVE_PEER'

function addPeer(id, stream) {
  return {
    type: 'ADD_PEER',
    id,
    stream: URL.createObjectURL(stream),
  }
}

function removePeer(id) {
  connections.deleteConnection(id)
  return {
    type: 'REMOVE_PEER',
    id,
  }
}

function getConnection(dispatch, id) {
  let pc = connections.getConnection(id)
  if (pc) return pc
  pc = new RTCPeerConnection({ iceServers: connections.iceServers })
  connections.putConnection(id, pc)
  pc.addStream(connections.stream)
  pc.onicecandidate = e => {
    connections.socket.emit('msg', {
      by: connections.id,
      to: id,
      ice: e.candidate,
      type: 'ice',
    })
  }
  pc.onaddstream = e => {
    console.log('kurwaa', e)
    dispatch(addPeer(id, e.stream))
  }
  return pc
}

function makeOffer(dispatch, id) {
  let pc = getConnection(dispatch, id)
  pc
    .createOffer({
      mandatory: { OfferToReceiveVideo: 1, OfferToReceiveAudio: 1 },
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    })
    .then(offer => pc.setLocalDescription(offer))
    .then(() => {
      console.log('New offer created for ', id)
      connections.socket.emit('msg', {
        by: connections.id,
        to: id,
        sdp: pc.localDescription,
        type: 'sdp-offer',
      })
    })
    .catch(e => console.log(e))
}

function handleMessage(dispatch, data) {
  var pc = getConnection(dispatch, data.by)
  switch (data.type) {
    case 'sdp-offer':
      pc.setRemoteDescription(data.sdp).then(() => {
        console.log('Setting remote description by offer')
        pc.createAnswer().then(sdp => {
          console.log('Setting local description and sending answer')
          pc.setLocalDescription(sdp)
          connections.socket.emit('msg', {
            by: connections.id,
            to: data.by,
            sdp,
            type: 'sdp-answer',
          })
        })
      })
      break
    case 'sdp-answer':
      pc.setRemoteDescription(data.sdp).then(() => {
        console.log('Setting remote description by answer')
      })
      break
    case 'ice':
      if (data.ice) pc.addIceCandidate(new RTCIceCandidate(data.ice))
      console.log('ICE candidate added')
      break
  }
}

function mediator(dispatch) {
  connections.socket.on('peer.connected', params =>
    makeOffer(dispatch, params.id)
  )

  connections.socket.on('peer.disconnected', peer =>
    dispatch(removePeer(peer.id))
  )

  connections.socket.on('msg', data => handleMessage(dispatch, data))

  connections.socket.emit('check', id => console.log('ID: ', id))
}

export function init(stream) {
  connections.stream = stream
  return dispatch => {
    var socket = io('http://10.0.1.13:3001')
    socket.emit('init', id => {
      connections.id = id
    })
    connections.socket = socket
    mediator(dispatch)
  }
}
