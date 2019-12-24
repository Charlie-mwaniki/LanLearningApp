import React from "react";
import ToastConnection from './parts/Toast';
import StarRatingComponent from 'react-star-rating-component';
import Display from './parts/Display';
import Join from './parts/Join';
export default class Rating extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            username: '',
            message: '',
            rating:1
                };
        this.sendMessage = ev => {
            ev.preventDefault();
            this.props.emit('SEND_MESSAGE', {
                author: this.props.member.regNumber,
                message: this.state.message,
                rate: this.state.rating
            })
           // this.setState({message: ''});
        }

        this.onStarClick = this.onStarClick.bind(this);
    }

    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
      }

    render(){
        return (

        <div className="container"> 
        <h3 className="text-center">Review and rate the session...</h3> 
        
        <Display if={this.props.member.name && this.props.member.type === 'audience'}>	
        <div className="col-lg-12 d-flex">  
        <div className="col-lg-6 card-footer">
        <h4>Rate the session (1-10)</h4>
        <StarRatingComponent 
        name="rate1" 
        starCount={10}
        value={this.state.rating}
        onStarClick={this.onStarClick.bind(this)}
        />
        <h5> {this.state.rating} stars</h5>
        </div> 
        <div className="col-lg-6 card-footer">
        <input type="text" required placeholder="Username" value={this.props.member.regNumber} onChange={ev => this.setState({username: this.props.member.regNumber})} className="form-control"/>
        <br/>
        <input type="text" required placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}/>
        <br/>
        <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
        </div>

        </div>  
        </Display>
        {(!this.props.member.regNumber)?<Join emit={this.props.emit} />:null}

        <div className="toast">
        <ToastConnection /> 
        </div>   
        </div>


        );
    }
}
