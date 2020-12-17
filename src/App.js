import React from 'react';
import './App.css';
import lottie from 'lottie-web';
import lottieApi from 'lottie-api';
import animationData from './lottie/man.json';

import { SyncOutlined, PauseCircleTwoTone, PlayCircleTwoTone } from '@ant-design/icons';

import { Slider } from 'antd';

import 'antd/dist/antd.css';

let animObj = null;
let animAPI;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentFrame: 0,
      totalFrames: 0,
      isPlaying: true,
      autoPlay: true,
    }
  }
  componentDidMount() {
    // call the loadAnimation to start the animation
    animObj = lottie.loadAnimation({
      container: this.animBox,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData
    });

    animAPI = lottieApi.createAnimationApi(animObj);

    animObj.addEventListener('enterFrame', (event) => {
      this.setState({
        // currentFrame: toFixed(event.currentTime, 1),
        currentFrame: Math.round(event.currentTime),
        totalFrames: event.totalTime
      })
    })

    animObj.addEventListener('loopComplete', (event) => {
      console.log('loop complete', event);
      if (!this.state.autoPlay) {
        animObj.stop();
        this.setState({ isPlaying: false })
      }
    })


  }

  handleStop = () => {
    console.log('this.state.currentFrame', this.state.currentFrame);
    this.setState({ isPlaying: false }, () => {
      animObj.goToAndStop(this.state.currentFrame, true);
    })
  }

  handlePlay = () => {
    this.setState({ isPlaying: true }, () => {
      animObj.play();
    })
  }

  handleRangeChange = (event) => {
    console.log('event', event);
    console.log('event', event.target.value);
    let frame = Number(event.target.value);
    this.setState({ currentFrame: frame }, () => {
      if (this.state.isPlaying) {
        animObj.goToAndPlay(frame, true);
      } else {
        animObj.goToAndStop(frame, true);
      }
    })
  }

  handleSliderChange = (value) => {
    this.setState({ currentFrame: value }, () => {
      if (this.state.isPlaying) {
        animObj.goToAndPlay(value, true);
      } else {
        animObj.goToAndStop(value, true);
      }
    })
  }
  
  handleAutoPlayToggle = () => {
    this.setState({ autoPlay: !this.state.autoPlay }, () => {
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Lottie</h1>
        <div className="toolbar">
          {this.state.isPlaying &&
            <PauseCircleTwoTone onClick={this.handleStop} />
            // <button onClick={this.handleStop}>Stop</button>
          }
          {!this.state.isPlaying &&
            <PlayCircleTwoTone onClick={this.handlePlay} />
            // <button onClick={this.handlePlay}>Play</button>
          }
          {/* <input
            type="range"
            id="range"
            onChange={this.handleRangeChange}
            value={this.state.currentFrame}
            step="1"
            min="0"
            max={this.state.totalFrames}
          /> */}
          <div className="slider-container">
            <Slider
              onChange={this.handleSliderChange}
              value={this.state.currentFrame}
              step={1}
              min={0}
              max={this.state.totalFrames}
            />
          </div>
          <SyncOutlined
            style={{ color: this.state.autoPlay ? '#1890ff' : '#3d3d3d' }}
            onClick={this.handleAutoPlayToggle} />
        </div>
        <p>{this.state.currentFrame} - {this.state.totalFrames}</p>
        <div style={{ width: 400, margin: '0 auto'}} ref={ ref => this.animBox = ref}></div>
      </div>

    )
  }
}

export default App;
