import { Link } from "react-router-dom";
import React from 'react';
import Display from './parts/Display';
var BarChart = require('react-d3').BarChart;
export default class Report extends React.Component{

	barGraphData(results, currentQuestion) {
		var a = currentQuestion.a;
		var b = currentQuestion.b;
		var c = currentQuestion.c;
		var d = currentQuestion.d;
		var answers = [a, b, c, d];
		var counter = 0;
		return Object.keys(results).map(function(choice) {
			var label = choice.toUpperCase() + ". " + answers[counter];
			counter++;
			console.log(counter);
			return {
				label: label,
				value: results[choice]
			};
		});
	}

    render() {
		return (
			<div id="scoreboard" className="container">
				<h4><Link to="/">&#8592; Back to question</Link></h4>
				<Display if={this.props.status === 'connected' && this.props.report}>
					<BarChart data={this.barGraphData(this.props.report.num,this.props.report.question)} 
							  title="new report" 
							  height={window.innerHeight * 0.5} 
							  width={window.innerWidth * 0.6}
							  margin={{top: 10, bottom: 500, left: 50, right: 10}}
					/>
				</Display>
				<Display if={this.props.status === 'connected' && !this.props.report}>
					<h4>Awaiting a Question...</h4>
				</Display>
			</div>
		);
    }
    

}
