import { Link } from "react-router-dom";
import React from 'react';
import Display from './Display';
import axios from 'axios';
var number = 1;
localStorage.num = number;
var myQuestn ;
var tid=[];
var clicked=[];
export default class Quiz extends React.Component{
	constructor(props){
		super(props);
		this.state =  {
			choices: [],
			marks: undefined,
			answer: undefined,
			sessionid: sessionStorage.id,
			index: undefined,
			question: undefined,
			opts: [],
			num: undefined,
			resp: undefined,
			id:[],
			uuid: undefined
		};
		this.select = this.select.bind(this);
		this.addChoiceButton = this.addChoiceButton.bind(this);
		this.setUpChoices = this.setUpChoices.bind(this);
		this.getMyQuest = this.getMyQuest.bind(this);
		
	}
	componentWillMount() {
		this.setUpChoices();
		this.getMyQuest(parseInt(localStorage.num));
	}
   
    componentWillUpdate(prevProps){
		//console.log("prevProps ",prevProps.messages.length)
		if(prevProps !== this.props ){
			this.setUpChoices();
		}
	}

	   getQuestion = async (n) => {
			try {
				return await axios.get("http://127.0.0.1:3000/api/q/"+n)
			  } catch (error) {
				console.error(error)
			  }
	  }

	  getMyQuest = async (n) => {
		 if(!this.props.startquiz ){
			if(parseInt(localStorage.num)>this.state.num ){
				//change button to disabled
					const nxtbtn = document.querySelector('#nxt');
					nxtbtn.setAttribute('disabled', true);
				
				}else{
					myQuestn = await this.getQuestion(n);
					if (myQuestn) {
						this.setState({ question: myQuestn.data.resp.q ,opts: Object.values(myQuestn.data.resp) ,  num:myQuestn.data.num, resp: myQuestn.data.resp, uuid: myQuestn.data.id});
						number+=1;
						localStorage.num=number;
					  }
				}
		 }
			

	  }
	  
	// sets state for / assign values to "choices" and "answer" (if user already answered and their answer was stored in sessionStorage)
	setUpChoices() {
		// choices.shift(); 
		this.setState({ 
			choices: ["a", "b", "c", "d"],
			//marks: sessionStorage.mark,
			answer: sessionStorage.answer
		});
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
	// sets state for / assign values to "answer" and sends "answer" back to server
	select(choice,btnid) {
		var myid = tid.push(myQuestn.data.resp.id)
		this.setState({ id: myid });
		var nxtbtn = document.querySelectorAll('#'+btnid);
		nxtbtn.forEach(function(btn){
			//btn.setAttribute('disabled', true);
			//this.toggleClass(btnopts);
		});

		var index=clicked.includes(btnid);
		if(!index && this.props.testo !== 'false'  ){
			this.setState({ answer: choice });
			sessionStorage.answer = choice;
			//sessionStorage.mark = this.props.question.m; 
			this.props.emit('answer', {
				question: this.state.resp,
				mark:  this.state.opts[5],
				choice: choice,
				userreg: localStorage.reg,
				uhash: localStorage.hash
			});
			clicked.push(btnid);
		}
		
	}
	
	addChoiceButton(choice, i) {
		var { uuid } = this.state;
		var btnn = "btnopts"+uuid;
		return (
			<div key={i} className="button-spacing col-md-12">
				<button key={i} id={btnn}
				        className={"btn btn-info mb-1 mt-1"}
				        onClick={this.select.bind(null, choice,btnn)}>
					{choice.toUpperCase()}. {this.state.opts[i+1]}
				</button>
			</div>
		);
	}

	render() {
		var { id } = this.state;
		//var qid = id.findIndex(x => x.regNumber == payload.userreg);
console.log("this.props.startquiz ",this.props.testo)
		return (
<div className="col-md-12">

<Display if={!this.props.startquiz}>
<div className="col-md-2 bg-success pt-2 pb-2 pl-2 pr-2 text-center timerpos2 ">
	<span>
	{(this.props.timer.hr !== "00") ? this.props.timer.hr : "00" }<small>hr</small>
	{(this.props.timer.min !== "00") ? this.props.timer.min : "00" }<small>min</small>
	{(this.props.timer.sec !== "00") ? this.props.timer.sec : "00" }<small>sec</small>
	</span>
	 </div>
</Display>
<Display if={this.props.quizover === 'false' }>
<div className="col-md-2 bg-success pt-2 pb-2 pl-2 pr-2 text-center timerpos2 ">
	<span>
	Time is over...
	</span>
	 </div>
</Display>


<div className="col-md-12 d-flex">
<div id="currentQuestion" className="col-md-10" >

<Display if={!this.props.startquiz}>
<h4>{this.state.question}</h4>
<h5>{this.state.opts[5] } marks</h5>
<p>{parseInt(localStorage.num)-1} of {this.state.num} </p>
<div className="col-md-12">
{this.state.choices.map(this.addChoiceButton)}
</div>
<div className="gap"></div>
<button type="button" class="btn btn-info" id="nxt" onClick={ this.getMyQuest.bind(null, parseInt(localStorage.num)) } >Next</button>
</Display>
</div>
<div className="col-md-2" >
<button type="button" className="btn btn-success">Score: { this.props.m }</button> 
</div>

</div>

</div>

		);
	}
};