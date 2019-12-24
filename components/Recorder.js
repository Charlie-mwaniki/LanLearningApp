import React, { Component } from 'react';
import RecorderJS from 'recorder-js';

import { getAudioStream, exportBuffer } from './parts/Audio';

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stream: null,
      recording: false,
      recorder: null
    };
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
  }

  async componentDidMount() {
    
    let stream;

    try {
      stream = await getAudioStream();
    } catch (error) {
      // Users browser doesn't support audio.
      // Add your handler here.
      console.log(error);
    }
    this.setState({ stream});
  }

  startRecord() {
    sessionStorage.recording =true;
    const { stream } = this.state;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const recorder = new RecorderJS(audioContext);
    recorder.init(stream);

    this.setState(
      {
        recorder,
        recording: true
      },
      () => {
        recorder.start();
      }
    );
  }

  async stopRecord() {
    sessionStorage.recording =false;
    const { recorder } = this.state;
    const { buffer } = await recorder.stop()
    const audio = exportBuffer(buffer[0]);
    // Process the audio here.
    console.log("audio ",audio);
    this.setState({
      recording: false
    });
  
  var save2file = (function () {
      var a = document.createElement("a");
      document.body.appendChild(a);
      return function (data) {
          var blob = data,
              url = window.URL.createObjectURL(blob);
              console.log("save2file blob ",blob)
          a.href = url;
          a.download =  'audio_recording_' + new Date().getTime() + '.wav';
          a.click();
          window.URL.revokeObjectURL(url);
      };
  }());

  save2file(audio);

  }

  render() {
    const { recording, stream } = this.state;

    // Don't show record button if their browser doesn't support it.
    if (!stream) {
      return null;
    }

    return (
      <button type="button" className="btn btn-outline-secondary"
        onClick={() => {
          recording ? this.stopRecord() : this.startRecord();
        }}
        >
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
    );
  }
}

export default Recorder;
