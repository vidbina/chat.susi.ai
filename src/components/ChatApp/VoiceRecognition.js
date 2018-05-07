import { Component } from 'react';
import PropTypes from 'prop-types';

let counter = 0;

class VoiceRecognition extends Component {
  constructor (props) {
    super(props)

    const SpeechRecognition = window.SpeechRecognition
      || window.webkitSpeechRecognition
      || window.mozSpeechRecognition
      || window.msSpeechRecognition
      || window.oSpeechRecognition

    if (SpeechRecognition != null) {
      this.recognition = this.createRecognition(SpeechRecognition)
      console.log('SpeechRecognition');
      console.log(this.recognition);
    } else {
      console.warn('The current browser does not support the SpeechRecognition API.');
    }
  }

  createRecognition = (SpeechRecognition) => {
    const defaults = {
      continuous: true,
      interimResults: true,
      lang: 'en-US'
    }

    const options = Object.assign({}, defaults, this.props)

    let recognition = new SpeechRecognition()

    recognition.continuous = options.continuous
    recognition.interimResults = options.interimResults
    recognition.lang = options.lang

    return recognition
  }

  bindResult = (event) => {
    let interimTranscript = ''
    let finalTranscript = ''
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript
      } else {
        counter++;
        interimTranscript += event.results[i][0].transcript
      }
    }
    if(counter === 0 ){
      interimTranscript = undefined;
    }

    console.log('interim');
    console.log(interimTranscript);

    console.log('final');
    console.log(finalTranscript);

    this.props.onResult({interimTranscript,finalTranscript })
  }
  start = () => {
    console.log('start recognition');
    this.recognition.start()
  }

  onspeechend = () => {
    console.log('speech ended');
    this.recognition.stop()
  }

  stop = () => {
    console.log('stop recognition');
    this.recognition.stop()
  }

  abort = () => {
    console.log('abort');
    this.recognition.abort()
  }

  componentWillReceiveProps ({ stop }) {
    if (stop) {
      this.stop()
    }
  }

  componentDidMount () {
    const events = [
      { name: 'start', action: this.props.onStart },
      { name: 'end', action: this.props.onEnd },
      { name: 'speechstart', action: this.props.onSpeechStart}
    ]

    events.forEach(event => {
      console.log('event');
      console.log(event);
      this.recognition.addEventListener(event.name, event.action)
    })

    this.recognition.addEventListener('result', this.bindResult)

    console.log('START');
    this.start()
  }

  componentWillUnmount () {
    console.log('unmounting');
    this.abort()
  }

  render () {
    return null
  }
}

VoiceRecognition.propTypes = {
  onStart: PropTypes.func,
  onSpeechStart: PropTypes.func,
  onEnd : PropTypes.func,
  onResult: PropTypes.func,
  continuous: PropTypes.bool,
  lang: PropTypes.string,
  stop: PropTypes.bool
};

export default VoiceRecognition
