
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import uuidv1 from 'uuid/v1';
export default class Form extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            message: false
        }
        this.create = this.create.bind(this);
    }
    create(ev) {
        ev.preventDefault();
                var q = ReactDOM.findDOMNode(this.refs.q).value;
                var a = ReactDOM.findDOMNode(this.refs.a).value;
                var b = ReactDOM.findDOMNode(this.refs.b).value;
                var c = ReactDOM.findDOMNode(this.refs.c).value;
                var d = ReactDOM.findDOMNode(this.refs.d).value;
                var m = ReactDOM.findDOMNode(this.refs.m).value;
                var correct = ReactDOM.findDOMNode(this.refs.correct).value;
                this.props.emit('createquiz', { "q": q, "a": a, "b":b, "c":c, "d":d, "m":m, "correct":correct,"id":uuidv1() });
                this.setState({ message: true });
          }

    render() {
		return (
     
			<div className="row">
                
         <div className="gap"></div>
			<div className="col-lg-6 offset-lg-3 pb50 pr50 pl50">
      { (this.state.message) ? <div className="alert alert-info">
      <button className="close" type="button" data-dismiss="alert"><span aria-hidden="true">×</span>
      </button>
      <p className="text-small">Question added successfully</p>
      <Link to="/quiz">Return to start quiz </Link>
  </div>: null }
        
	<form onSubmit={this.create}>
  <div className="form-group">
    <label key={uuidv1()} htmlFor="exampleInputEmail1">Question</label>
    <input key={uuidv1()} type="text" className="form-control"  ref="q" required/>
  </div>
  

  <div className="form-group">
    <label key={uuidv1()} htmlFor="exampleInputEmail1">Choice A</label>
    <input key={uuidv1()} type="text" className="form-control"  ref="a" required/>
  </div>

  <div className="form-group">
    <label key={uuidv1()} htmlFor="exampleInputEmail1">Choice B</label>
    <input key={uuidv1()} type="text" className="form-control" ref="b" required/>
  </div>

  <div className="form-group">
    <label key={uuidv1()} htmlFor="exampleInputEmail1">Choice C</label>
    <input key={uuidv1()} type="text" className="form-control"  ref="c" required/>
  </div>


  <div className="form-group">
    <label key={uuidv1()} htmlFor="exampleInputEmail1">Choice D</label>
    <input key={uuidv1()} type="text" className="form-control" ref="d" required/>
  </div>

  <div className="form-group">
    <label key={uuidv1()} htmlFor="exampleInputEmail1">Marks</label>
    <input key={uuidv1()} type="text" className="form-control" ref="m" required/>
  </div>
  <div className="form-group">
    <label key={uuidv1()} htmlFor="exampleInputEmail1">Correct choice</label>
    <input key={uuidv1()} type="text" className="form-control" ref="correct" required/>
  </div>

  <button type="submit" className="btn btn-primary">Add question</button>
</form>
		</div>
		</div>
		);
	}

}