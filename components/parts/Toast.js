import React from 'react';
import $ from 'jquery';
export default class ToastConnection extends React.Component{
  constructor(props){
    super(props);
    this.state={reg:undefined}
  }
  componentDidMount() {
    //this.setState({reg:this.props.leftclients.regNumber})
    $(document).ready(function(){
        $('.toast').toast('show');
      });
}
componentWillUpdate(props){
  (props != this.props) ? this.setState({reg:this.props.leftclients.regNumber}):null;
}

render(){

   //if(this.props.newuser === true && typeof this.props.leftclients.regNumber === 'string'){
  return(
<div className="bottom-right">
      <div className="toastie " aria-live="polite" aria-atomic="true" >
      <div className=" col-md-12">
         <div className="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="5000" data-animation="true">
    <div className="toast-header">
    <svg className="bd-placeholder-img rounded mr-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img"><rect fill="#007aff" width="100%" height="100%"></rect></svg>
      <strong className="mr-auto">New client</strong>
      <small className="text-muted">just now</small>
      <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div className="toast-body bg-light">
    { this.state.reg } just joined session.
    </div>
  </div>
 </div>
    </div>

    </div>
  );

}

};