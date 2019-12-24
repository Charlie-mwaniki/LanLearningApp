import React from 'react';
import Display from './parts/Display';
import Join from './parts/Join';
import Ask from './parts/Ask';
import Quiz from './parts/Quiz';
import { Redirect } from "react-router-dom";
import Speaker from './Speaker';
import { Link } from "react-router-dom";
export default class Audience extends React.Component{

	render() {
		if(this.props.member.type !== 'audience'){
			<Redirect to='/speaker' /> 
		}
		
	return (<div>
		
		<div className="container">
			<Display if={this.props.status === 'connected'}>
			<Display if={ localStorage.reg }>
				<Display if={!this.props.startquiz}>
				<div className="row">
				<h3 className="float-left">Welcome {this.props.member.name} </h3>
				</div>
					<div className="row justify-content-center">
					<div className="text-center clearfix" role="alert">
						<div className="alert alert-primary justify-cont">
								Waiting for teacher to load new content...
								</div>
								<div className="spinner-border text-primary floatcenter2" role="status">
								<span className="sr-only">Loading...</span>
								</div>
								</div>
								</div>
				</Display>
				<Display if={this.props.startquiz}>
					<div className="row">
						<Quiz question={this.props.currentQuestion} timer={ this.props.timer } m={ this.props.usrmark } emit={this.props.emit} testo={this.props.startquiz} quiz={this.props.quizopts} member={ this.props.member } quizover={this.props.startquiz} />
					</div>
				</Display>
				<Display if={ this.props.startquiz === 'false' } >
<h4><Link to="/results">See results &#8594;</Link></h4>
</Display>
			</Display>
			<Display if={  !localStorage.reg }>
				<Join emit={this.props.emit} />
			</Display>
			{ /*(!this.props.member.regNumber)?<Speaker emit={this.props.emit} />:null */ }

		</Display>
		</div>
		</div>
		);
	}
}