import React from 'react';
// if the "if" property is true, then display the component's children
// "                     " false, then do nothing
export default class Display extends React.Component{
	render() {
		return (this.props.if) ? <span>{this.props.children} </span>: null;
	}
};