import React from 'react';
const PropTypes = require('prop-types');
import Display from './Display';
export default class Header extends React.Component{
	constructor(props){
		super(props);
		this.state={
			status: 'disconnected',
			title: undefined,
			speaker: undefined
		}
	}

	componentWillMount(){
		this.setState({title: this.props.title, speaker:this.props.speaker});
	  }

	render() {
		//console.log( "this.state.speaker !== ",this.state.speaker !== "undefined")
		//console.log("this.state.title) ",this.state.title)
		//( this.props.speaker !==  undefined && this.props.title !==  undefined  ) ? 
		return (
			
			<div className="container">
			<header className="clearfix">
				<div className="row fixed-bottom offset-md-1">
				<Display if={this.props.status === 'connected'}>
					<div className="alert alert-success ">
						<Display if={this.props.audience.length > 1 || this.props.audience.length === 0}>
							<div>{this.props.audience.length} students connected.</div>
						</Display>
						<Display if={this.props.audience.length == 1}>
							<div>{this.props.audience.length} student connected.</div>
						</Display>
					</div>
				</Display>
				<Display if={this.props.status !== 'connected'}>
					<div className=" alert alert-danger ">Disconnected...</div>
				</Display>
				</div>
			</header>
		
			<div className="border-bottom col-md-12 pt5 mb5 ">
				<h2 className="text-center">
		{ ( this.state.speaker !== "undefined"  ) ? this.state.title + " by " + this.state.speaker : this.state.title }
				</h2>	
				</div>
			</div>
		);
	}
};

Header.propTypes = {title: PropTypes.string.isRequired, speaker: PropTypes.string.isRequired  };
