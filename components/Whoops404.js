import React from 'react';
import { Link } from "react-router-dom";

export default class Whoops404 extends React.Component{
	render() {
		return (
			<div className="container">
				<div className="col-md-12 text-center">
				<h4>Whoops... The page you requested does not exist.</h4>
				<ul className="list-group">
					<li className="list-group-item"><Link to="/"><h4>Join the session</h4></Link></li>
				</ul>
			</div>
			</div>
		);
	}
};
