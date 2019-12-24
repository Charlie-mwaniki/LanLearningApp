import React from 'react';
import ReactDOM from 'react-dom';
import uuidv1 from 'uuid/v1';
export default class Join extends React.Component{
  constructor(props){
    super(props);
    this.join = this.join.bind(this);
  }
	join(ev) {
ev.preventDefault();
        var clientName = ReactDOM.findDOMNode(this.refs.name).value;
        var clientRegno = ReactDOM.findDOMNode(this.refs.regno).value;
        this.props.emit('join', { name: clientName, regNumber: clientRegno});
  }
  
	render() {
		return (
     
			<div className="row">
         <div className="gap"></div>
			<div className="col-lg-6 offset-lg-3 pb50 pr50 pl50">
	<form onSubmit={this.join}>
  <div className="form-group">
    <label key={uuidv1()} htmlFor="exampleInputEmail1">Full Name</label>
    <input key={uuidv1()} type="text" className="form-control"   placeholder="Enter name" ref="name" required/>
    <small key={uuidv1()} id="emailHelp" className="form-text text-muted">This field is required</small>
  </div>
  <div className="form-group">
    <label key={uuidv1()} htmlFor="exampleInputPassword1">Reg. No.</label>
    <input key={uuidv1()} type="text" className="form-control" placeholder="Reg Number" ref="regno" required/>
    <small key={uuidv1()} id="emailHelp" className="form-text text-muted">This field is required</small>
  </div>
  <button type="submit" className="btn btn-primary">Join</button>
</form>
		</div>
		</div>
		);
	}
};

