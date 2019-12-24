import React from "react";
import ToastConnection from './parts/Toast';
export default class Rating extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            messages:[]
        }
    }
   
    componentWillUpdate(prevProps){
            //console.log("prevProps ",prevProps.messages.length)
            if(prevProps !== this.props ){
                this.setState({ messages: this.props.messages });
            }
        }
        componentDidMount(){
            this.timer = setInterval( ()=> this.setState({ messages: this.props.messages }) , 1000 );
        }
        componentWillUnmount(){
            this.timer = null;
          }
        render(){
            return(

                <div className="container"> 
                <h3 className="text-center">Student Rating and Review</h3> 		
                <div className="row justify-content-center">
                {
                    (this.state.messages.length > 0) ?
                    <div id="message" className="col-md-6">
        <div className="text-wrap">
                    <ul className="list-group">
                    {this.state.messages.map((message,index) => {
                    return (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    {message.author}: {message.message}
                    <span className="badge badge-primary badge-pill">Stars: {message.rate}</span> 
                    </li>
                    )
                    })}
                    </ul>
                    </div>
                    </div>
                    :
             <div className="row justify-content-center">
                            <div className="text-center clearfix" role="alert">
                                <div className="alert alert-primary justify-cont">
                                        Waiting for the feedback...
                                        </div>
                                        <div className="spinner-border text-primary floatcenter2" role="status">
                                        <span className="sr-only">Loading...</span>
                                        </div>
                                        </div>
                                        </div>
                }
                
                </div>
              
                <div className="toast">
                <ToastConnection /> 
                </div>   
                </div>


            )
        }
}