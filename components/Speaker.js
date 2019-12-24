
import React from 'react';
import Display from './parts/Display';
import JoinSpeaker from './parts/JoinSpeaker';
import Attendance from './parts/Attendance';
import Questions from './parts/Questions';

export default class Speaker extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			questions: null,
			audience: null,
			marks: null
		}
	}
	componentWillMount(){
		this.setState({ questions: this.props.questions, audience: this.props.audience, marks: this.props.marks   });
	}
	componentWillUpdate(prevProps){
		//console.log("prevProps ",prevProps.messages.length)
		if(prevProps !== this.props ){
			this.setState({ questions: this.props.questions, audience: this.props.audience, marks: this.props.marks   });
		}
		
	} 

render() {
return (
<div className="container">
<Display if={this.props.status === 'connected' && this.props.member.name && this.props.member.type === 'speaker'}>
	<div className="d-flex">
	<div className="col-md-8">
	<Questions questions={this.state.questions} emit={this.props.emit} />
	</div>
	<div className="col-md-4">
	<Attendance audience={this.state.audience} marks={ this.state.marks } />
	</div>
	</div>
</Display>
{(!this.props.member.type)?<JoinSpeaker emit={this.props.emit} />:null}
</div>
);

}
};
