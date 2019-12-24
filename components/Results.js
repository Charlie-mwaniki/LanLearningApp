import React from 'react';
import { Link } from "react-router-dom";
import Display from './parts/Display';
export default class Quizopts extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            q: [],
            choices: ["a", "b", "c", "d"],
        }
        this.getresults = this.getresults.bind(this);
    }
componentDidMount(){
    this.setState({ q: this.props.quiz })
}
componentDidUpdate(prevprops){
(prevprops.quiz !== this.props.quiz) ? this.setState({ q: this.props.quiz }):null;
}
    getresults(Questions, key){
        var colors=["bg-primary","bg-success","bg-danger"];
        if(Questions.choice === Questions.answer){
            colors="bg-success"+Questions.answer;
        }else if(Questions.choice !== Questions.answer){
            colors="bg-danger"+Questions.answer;
        }else{
            colors="bg-primary";
        }
       return (
           <div>
        <h3 key={key}> { Questions.question.q }</h3>
        <ul className="list-group">
            <li className={"list-group-item "}>A. { Questions.question.a }</li>
            <li className={"list-group-item "}>B. { Questions.question.b }</li>
            <li className={"list-group-item "}>C. { Questions.question.c }</li>
            <li className={"list-group-item "}>D. { Questions.question.d }</li>
         
         
        </ul>
        <h4 className="pt-4">Your choice { Questions.answer.toUpperCase()  } and correct answer is { Questions.choice.toUpperCase()  }</h4>
        <div className="gap"></div>
        </div>
       )
    }

 render(){
     var { q } = this.state;
    //console.log(Object.keys(q).length)
     //<h1>{this.props.quiz.questions.questions[this.props.quiz.user].question.q} </h1>
return ( 
   // { q.questions.map(this.getresults) }
    //getresults(this.props.quiz)  payload[0].questions.map((s) => console.log(s.question.q))
    <div className="container">
<Display if={ !this.props.quizhist }>
<h4>Awaiting history data...</h4>
</Display>
<Display if={ this.props.quizhist && this.props.quiz.length > 0 }>
<h4 className="text-center">Results are ready.</h4>
<p><Link to="/">Return to lobby</Link></p>
<div className="col-md-8 offset-2">
{ q.map(this.getresults) }
</div>
</Display>

</div>
    );
    }
}