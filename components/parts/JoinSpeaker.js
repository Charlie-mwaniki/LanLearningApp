import React from 'react';
import ReactDOM from 'react-dom';
import uuidv1 from 'uuid/v1';
export default class JoinSpeaker extends React.Component{
	constructor(props){
		super(props);
		this.start = this.start.bind(this);
	  }
	start(ev) {
		ev.preventDefault();
		var speakerName = ReactDOM.findDOMNode(this.refs.name).value;
		var course = ReactDOM.findDOMNode(this.refs.course).value;
		this.props.emit('start', { name: speakerName, title: course });
	}
	render() {
		return (
<div className="row">
<div className="gap"></div>
   <div className="col-lg-6 offset-lg-3 pb50 pr50 pl50">
<form onSubmit={this.start}>
<div className="form-group">
<label key={uuidv1()} htmlFor="exampleInputEmail1">Full Name</label>
<input key={uuidv1()} type="text" className="form-control"   placeholder="Enter name" ref="name" required/>
<small key={uuidv1()} id="emailHelp" className="form-text text-muted">This field is required</small>
</div>
<div className="form-group">
<label key={uuidv1()} htmlFor="exampleInputPassword1">Course Title</label>
<input key={uuidv1()} type="text" className="form-control" placeholder="Course Name" ref="course" required/>
<small key={uuidv1()} id="emailHelp" className="form-text text-muted">This field is required</small>
</div>
<button type="submit" className="btn btn-primary">Start Session</button>
</form>
</div>
</div>


		);
	}
};
