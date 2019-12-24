import React, { Component } from 'react';
import Reveal from 'reveal.js/js/reveal';
window.Reveal = Reveal;
import Canvas from './parts/Canvas';
import Join from './parts/Join';
import Io from 'socket.io-client';
import Master from 'reveal.js/plugin/multiplex/master';
import Client from 'reveal.js/plugin/multiplex/client';
var ip = sessionStorage.ip+":3000";
window.io = Io;
window.ip = ip;
var img = [];
export default class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: ["loading"]
    };
  }

  getimages = async () => {
    await fetch("http://"+ sessionStorage.ip +":3000/api/slides",{ 
      signal: this.abortController.signal ,
      headers:{ 
        "Content-Type": "text/plain"
      }
    })
      .then(response => response.text())
      .then(text => text.length > 0 ? JSON.parse(text) : {})
      .then(data => this.setState({ images: data }));
  }

  abortController = new AbortController();

  componentWillMount(){
    this.getimages(); 
  }


  componentDidMount(){
    
    if(window.location.host === '127.0.0.1:3000'  ){
      global.Reveal.initialize({
        controls: true,
        progress: true,
        hash:true,
        history: true,
        center: true,
        transition: 'zoom', // none/fade/slide/convex/concave/zoom
        slideNumber: 'h.v',
        multiplex: {
          secret: '13652805320794272084', // Obtained from the socket.io server. Gives this (the master) control of the presentation
          id: '1ea875674b17ca76', // Obtained from socket.io server
          url: ip // Location of socket.io server
        },
        dependencies: [
          { src: Io, async: true },
          { src: Master, async: true },
          { src: Client, async: true }
        ]});
      }else{
      global.Reveal.initialize({
        controls: false,
        progress: false,
        hash:false,
        history: false,
        center: true,
        transition: 'zoom', // none/fade/slide/convex/concave/zoom
        slideNumber: 'h.v',
        multiplex: {
          secret: null, // Obtained from the socket.io server. Gives this (the master) control of the presentation
          id: '1ea875674b17ca76', // Obtained from socket.io server
          url: ip // Location of socket.io server
        },
        dependencies: [
          { src: Io, async: true },
          { src: Master, async: true },
          { src: Client, async: true }
        ]
      });
      }
        
    Canvas.init();
    this.timer = setInterval( ()=> this.getimages(), 1000 );
  }


  componentWillUnmount(){
    this.abortController.abort();
    clearInterval(this.timer);	
    this.timer = null;
  }
 
  renderSlides(slides) {
    return slides.map((Slides, key) => {
      Slides=Slides.replace(/.*[\/\\]/, '');
       if ( Slides.includes('png')) {
         //<img src={require('path').dirname(process.execPath)+"/images/"+Slides} alt={Slides}/>
         //<img src={__process.cwd()+"images/"+Slides} alt={Slides}/>
        // "http://"+ sessionStorage.ip +":3000/images/"+Slides
         
        return (
          <section className="present" key={key}>
         <img src={"http://"+ sessionStorage.ip +":3000/slide/"+Slides} alt={Slides}/>
          </section>
        );
      } else{
        return ( 
            <section className="present" >
            <div className="row text-center justify-content-center ">
            <div className="col-md-4 alert alert-primary mt40">
            Waiting for the slides...
            </div>
            <div className="spinner-border text-primary floatcenter" role="status">
            <span className="sr-only">Loading...</span>
            </div>
            </div>
            </section>
        );
      }
    });
  }

  render() {

//console.log("prc.cwd() "+process.cwd());
//console.log("__dirname"+__dirname);
//console.log("path procexec "+require('path').dirname(process.execPath));
    const { images } = this.state;
    return (
      
<div id="present">
<canvas className="whiteboard" ></canvas>
<div className="colors">
  <div className="color red"></div>
  <div className="color blue"></div>
  <div className="color green"></div>
</div>
      <div className="reveal" id="reveal">
        <div className="slides">
        { this.renderSlides(images) }
        </div>
      </div>
      </div>
    
    );
  }
}

