import { Link } from "react-router-dom";
import React from 'react';
import Display from './Display';
export default class Ask extends React.Component{
	constructor(props){
		super(props);
		this.state =  {
			choices: [],
			marks: undefined,
			answer: undefined,
			sessionid: sessionStorage.id,
			index: undefined
		};
		this.select = this.select.bind(this);
		this.addChoiceButton = this.addChoiceButton.bind(this);
		this.setUpChoices = this.setUpChoices.bind(this);
	}
	UNSAFE_componentWillMount() {
		this.setUpChoices();
	}

	// sets state for / assign values to "choices" and "answer" (if user already answered and their answer was stored in sessionStorage)
	setUpChoices() {
		var choices = Object.keys(this.props.question);
		// choices.shift();
		this.setState({ 
			choices: ["a", "b", "c", "d"],
			//marks: sessionStorage.mark,
			answer: sessionStorage.answer
		});
	}

	// sets state for / assign values to "answer" and sends "answer" back to server
	select(choice) {
		this.setState({ answer: choice });
		sessionStorage.answer = choice;
		//sessionStorage.mark = this.props.question.m; 
		this.props.emit('answer', {
			question: this.props.question,
			mark: this.props.question.m,
			choice: choice,
			userreg: localStorage.reg,
			uhash: localStorage.hash
		});
	}
	addChoiceButton(choice, i) {
		return (
			<div key={i} className="button-spacing col-lg-12">
				<button key={i} 
				        className={"btn btn-primary  mt-1 mb-1"}
				        onClick={this.select.bind(null, choice)}>
					{choice.toUpperCase()}. {this.props.question[choice]}
				</button>
			</div>
		);
	}
	render() {
		return (
			<div>
<div className="col-lg-2 bg-success pt-2 pb-2 pl-2 pr-2 text-center timerpos2 ">
	<Display if={ this.props.timer.hr === "00" && this.props.timer.min === "0" && this.props.timer === "00"} >
		<span>Time is over...</span>
	</Display>
	<span>
	{(this.props.timer.hr !== "00") ? this.props.timer.hr : "00" }<small>hr</small>
	{(this.props.timer.min !== "00") ? this.props.timer.min : "00" }<small>min</small>
	{(this.props.timer.sec !== "00") ? this.props.timer.sec : "00" }<small>sec</small>
	</span>
	 </div>
<div className="col-lg-12 d-flex">
<div id="currentQuestion" className="col-lg-10" >
<Display if={this.state.answer && this.props.member.type === 'audience' && this.props.timer.message }  >
<h4><Link to="/results">See results &#8594;</Link></h4>
</Display>
<Display if={!this.state.answer}>
<h4>{this.props.question.q}</h4>
<h5>{this.props.question.m} marks</h5>
<div className="col-lg-12">
{this.state.choices.map(this.addChoiceButton)}
</div>
</Display>
</div>
<div className="col-sm-2" >
<button type="button" className="btn btn-success">Score: { this.props.m }</button> 
</div>

</div>

</div>
		);
	}
};