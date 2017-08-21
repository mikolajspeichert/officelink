import React, { Component } from 'react'
import { connect } from 'react-redux'
import 'tracking'
import 'tracking/build/data/face-min'
import { init, mute } from './actions'
import './App.sass'

class App extends Component {
  // constructor(props) {
  //   super(props)
  // }

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia(this.props.constraints)
      .then(stream => {
        // window.stream = stream
        if (window.URL) this.video.srcObject = stream
        else console.log('ERROR CREATING URL')
        this.props.dispatch(init(stream))

        let tracker = new tracking.ObjectTracker('face')
        let t = tracking.track('.video', tracker)
        t.stop()
        this.startTrackingLoop(tracker, t, stream)
        setInterval(() => {
          this.startTrackingLoop(tracker, t, stream)
        }, 60000)
      })
      .catch(error => {
        console.error('Error getting media: ', error)
        this.props.dispatch(init(null))
      })
  }

  startTrackingLoop(tracker, t, stream) {
    t.run()
    let detected = false
    tracker.on('track', e => {
      if (e.data.length > 0) detected = true
    })
    setTimeout(() => {
      t.stop()
      console.log('TRACKED', detected)
      stream.getAudioTracks()[0].enabled = detected
    }, 1000)
  }

  render() {
    return (
      <div className="App">
        <div className="remotes">
          {this.props.streams.map(stream =>
            <video
              className="remote"
              autoPlay
              src={stream.stream}
              key={stream.id}
            />
          )}
        </div>
        <video className="local video" ref={v => (this.video = v)} autoPlay />
        <canvas className="local canvas" ref={c => (this.canvas = c)} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  streams: state,
  constraints: {
    video: true,
    audio: true,
  },
})

export default connect(mapStateToProps)(App)
