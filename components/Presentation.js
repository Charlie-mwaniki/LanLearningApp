import React from 'react';
import Deck from './Deck';
import 'reveal.js/css/reveal.css';
import 'reveal.js/css/theme/white.css';
import './style/styles.css';
import './style/font-awesome.css';

export default class PresentNotes extends React.Component {
  render() {
   return (<Deck member={this.props.member}/>);
  }

}