import React, { Component } from 'react'
import { connect } from 'react-redux'
import { init } from './actions'
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
      })
      .catch(error => {
        console.error('Error getting media: ', error)
      })
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
        <video className="local" ref={v => (this.video = v)} autoPlay />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  streams: state.connections,
  constraints: {
    video: true,
    audio: !state.muted,
  },
})

export default connect(mapStateToProps)(App)
