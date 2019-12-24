import React from 'react';
export default class Attendance extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			audience: undefined
		}
	}

	componentWillMount(){
		this.setState({ audience: this.props.audience })
	}

	componentWillUpdate(prevProps){
		//console.log("prevProps ",prevProps.messages.length)
		if(prevProps !== this.props ){
			this.setState({ audience: this.props.audience });
		}
	}

	addMemberRow(member, i) {
		
		return (
			<tr key={i}>
				<td>{member.name}</td>
				<td>{member.regNumber}</td>
				<td>{member.mark}</td>
			</tr>
		);
	}

	
  
	render() {
		// .map() functions returns an array of JSX table row elements
		return (
			<div>
				<div className="gap"></div>
			<div className="row">
				<h4>Attendance ({this.props.audience.length})</h4>
				<table className="table table-bordered table-striped">
					<thead className="thead-light">
						<tr>
							<th>Name</th>
							<th>Registration Number</th>
							<th>Quiz</th>
						</tr>
					</thead>
					<tbody>
						{this.state.audience.map(this.addMemberRow)}
					</tbody>
				</table>
			</div>
			</div>
		);
	}
};