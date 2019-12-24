import React from 'react';
import { Link } from "react-router-dom";
export default class Questions extends React.Component{
	ismounted=false;
	constructor(props){
		super(props);
		this.ask = this.ask.bind(this);
		this.addQuestion = this.addQuestion.bind(this);
		this.timedCount = this.timedCount.bind(this);
		this.startquiz = this.startquiz.bind(this);
		this.state={
			timeout:undefined,
			c:60,
			quizOver:false,
			start: false,
			questions: []
		}
	  }
	   toggleClass(id) {
		var element = document.getElementById(id);
		if (element.classList) { 
		  element.classList.toggle("clicked");
		} else {
		  var classes = element.className.split(" ");
		  var i = classes.indexOf("clicked");
	  
		  if (i >= 0) 
			classes.splice(i, 1);
		  else 
			classes.push("clicked");
			element.className = classes.join(" "); 
		}
	}
	 timedCount() {
		var {timeout,c,quizOver} = this.state;
		if (c == 500) {
		  return false;
		}
		var hours = parseInt(c / 3600) % 24;
		var minutes = parseInt(c / 60) % 60;
		var seconds = c % 60;
		var result =
		  (hours < 10 ? "0" + hours : hours) +
		  "<small>hrs</small> :" +
		  (minutes < 10 ? "0" + minutes : minutes) +
		  "<small>min</small> :" +
		  (seconds < 10 ? "0" + seconds : seconds) + "<small>sec</small>";
		$("#time").html(result);
		localStorage.startquiz = true;
		this.props.emit('timer', {hr:(hours<10 ? "0"+hours : hours),min:(minutes<10 ? "0"+minutes : minutes), sec:(seconds<10 ? "0"+seconds : seconds),"startquiz":localStorage.startquiz});
		if (c == 0) {
			localStorage.startquiz = false;
		  this.props.emit('timer', { time:result, "startquiz":localStorage.startquiz, "message":false });
		  this.setState({c:500,quizOver:true});
		  return false;
		}
		c = c - 1;
		this.setState({c:c});
		timeout = setTimeout(function() {
			this.timedCount();
		}.bind(this), 1000);
	  }


	  clicknext(){
		var mybtn = document.querySelectorAll('.pointer');
		var i = 1;
		mybtn[i-1].click();
		var timer = setInterval(function() {
			 if( i < mybtn.length) {
				 mybtn[i].click();
			 } else {
				 clearInterval(timer);
			 }
			 i = i + 1;
		}, 5000);
	  }

	  componentWillMount(){
		  this.setState({ questions: this.props.questions });
	  }
	  componentDidMount(){
		this.setState({ questions: this.props.questions });
	}
	componentWillUpdate(prevProps){
		//console.log("prevProps ",prevProps.messages.length)
		this.ismounted = true;
		if(this.state.start){
			this.timedCount();
			//this.clicknext();
		}
		if(prevProps !== this.props ){
			this.setState({ questions: this.props.questions });
		}
	}

	componentWillUnmount(){
		clearTimeout(this.timeout);
		clearInterval(this.timer);	
		this.timeout = null;
		this.timer = null;
		this.ismounted = false;
	}
	// emits an "ask" event and sends the clicked / current question to the server
	ask(question,id) {
		this.toggleClass(id);
		this.props.emit('ask', question);
	}
	// <span onClick={this.ask.bind(null, question)}>{question.q}</span> means that when the speaker clicks on the <span>, question.q gets sent into the ask() function as the "question" argument
	addQuestion(question, i) {
		var btn="buttonID"+i;
		return (
<li id={btn} key={i} className="pointer list-group-item btn-primary mt-1 mb-1 " onClick={this.ask.bind(null, question, btn)}>
<span>{question.q}. { question.m } marks</span>
</li>		
		);
		}
	startquiz() {
		if(this.ismounted && Object.entries(this.state.questions).length > 0){
		this.setState(state => ({
			start: !state.start
		  }));

		  this.ismounted = false;
		}

	}
	render() {
		// .map() functions returns an array of JSX table row elements
		return (
			<div>
				<h4>Questions</h4>
			<div className=" sidebar-left">
				<div id="questions" >
					<ul className="list-group">
						{ (Object.entries(this.state.questions).length > 0 ) ? this.state.questions.map(this.addQuestion) : <div className="row text-center justify-content-center ">
            <div className="col-md-4 alert alert-primary mt40">
            No questions currently set...

			<Link to="/questions">Create new one </Link>
            </div>
            <div className="spinner-border text-primary floatcenter3" role="status">
            <span className="sr-only">Loading...</span>
            </div>
            </div> }
					
					</ul>
				</div>
			</div>
			<div id="hide btn" className="col-md-4 bg-success pt-2 pb-2 pl-2 pr-2 text-center timerpos" onClick={this.startquiz} ><span id="time">Start</span> </div>
			
			</div>
		);
	}
};