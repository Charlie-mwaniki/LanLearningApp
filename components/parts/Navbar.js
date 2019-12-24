import React from 'react';
import { NavLink } from "react-router-dom";
export default class Navbar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      link:window.location.hostname+':'+window.location.port
    }
    this.clearSession = this.clearSession.bind(this);
    this.sendevnt = this.sendevnt.bind(this);
  }
  componentDidMount(){
		$(function () {
			$('[data-toggle="tooltip"]').tooltip()
		  });
	  }


  clearSession(ev){
    ev.preventDefault();
    this.props.emit('clearsession');
  }
   sendevnt(ev,id){
    ev.preventDefault();
    this.props.emit('path',{ url: this.state.link, ext: id});
  }
 render(){
  // console.log(window.location.hostname+':'+window.location.port);
     return (
       <div className="container">
<div className=" bg-light d-inline">
<nav className=" navbar navbar-light align-middle bg-light">
  <button data-toggle="tooltip" data-placement="top" title="Show the menu" className="navbar-toggler btn-pos leftpos" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon" ></span>
  </button>

  <div className="btn-pos collapse navbar-expand-lg navbar-collapse align-middle" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
   
    <li className="nav-item border-right"  data-toggle="tooltip" data-placement="top" title="Select ppt to present from filesystem" >
        <NavLink to='/speaker' className="nav-link btn-light"><i className="fa fa-home"></i>Home</NavLink> 
      </li>

      <li className="nav-item border-left border-right" onClick={ ev => this.sendevnt(ev,'notes') }  data-toggle="tooltip" data-placement="top" title="Shared ppt files" >
        <NavLink to='/notes' className="nav-link btn-light"><i className="fa fa-file-powerpoint-o"></i>Shared ppts </NavLink> 
      </li>
  
      <li className="nav-item border-right" onClick={ ev => this.sendevnt(ev,'slides') }  data-toggle="tooltip" data-placement="top" title="Current presentation slides">
        <NavLink to="/slides" className="nav-link btn-light"><i className="fa fa-group"></i> Presentation</NavLink>
      </li>
      <li className="nav-item border-right" onClick={ ev => this.sendevnt(ev,'') }  data-toggle="tooltip" data-placement="top" title="Start a quiz session"> 
       <NavLink to="/quiz" className="nav-link btn-light"><i className="fa fa-pencil-square"></i> Quiz</NavLink>
      </li>
      <li className="nav-item border-right" onClick={ ev => this.sendevnt(ev,'chat') }  data-toggle="tooltip" data-placement="top" title="Get student feedback about the session" >
      <NavLink to="/review" className="nav-link btn-light"><i className="fa fa-comments"></i> Feedback</NavLink>
      </li>
      <li className="nav-item float-right border-right"  data-toggle="tooltip" data-placement="top" title="Class session is over...">
					<a href="#" onClick={this.clearSession} className="nav-link btn-outline-danger "><i className="fa fa-sign-out"></i> End session</a>
      </li>
    </ul>
  </div>
</nav>
</div>
</div>
     )
 }
};