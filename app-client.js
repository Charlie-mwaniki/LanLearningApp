import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery/dist/jquery.min.js';
import Popper from 'popper.js/dist/popper.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import _ from 'underscore';
import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import Audience from './components/Audience';
import Speaker from './components/Speaker';
import Selectppt from './components/Start';
import Whoops404 from'./components/Whoops404';
import Header from './components/parts/Header';
import ToastConnection from './components/parts/Toast';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Rating from './components/Chat';
import Review from './components/Review';
import Notes from './components/Notes';
import Quizopts from './components/Results';
import PresentNotes from './components/Presentation';
import Navbar from './components/parts/Navbar';
import uuidv1 from 'uuid/v1';
import Recorder from './components/Recorder';
import Form from './components/parts/QuizForm';
const PORT = window.location.port || '';
class Home extends React.Component{
	constructor(props){
		super(props);
		this.state = {
				status: 'disconnected',
				title: 'Welcome',
				member: {},
				audience: [],
				speaker: '',
				questions: [],
				currentQuestion: false,
				results: {},
				newuser: false,
				leftclients: [],
				newuserreg:'',
				username:'',
				message:'',
				messages:[],
				marks: [],
				usrmark: localStorage.mrk,
				quizopts:[],
				quizhist: false,
				timer: [],
				report:[],
				pptready:false,
				startquiz: false
		};
		
		this.connect = this.connect.bind(this);
		this.updateState = this.updateState.bind(this);
		this.joined = this.joined.bind(this);
		this.updateAudience = this.updateAudience.bind(this);
		this.start = this.start.bind(this);
		this.ask = this.ask.bind(this);
		this.leftclient = this.leftclient.bind(this);
		this.updateResults = this.updateResults.bind(this);
		this.newuserreg = this.newuserreg.bind(this);
		this.disconnect = this.disconnect.bind(this);
		this.sendmessage = this.sendmessage.bind(this);
		this.recvmessage = this.recvmessage.bind(this);
		this.destroy = this.destroy.bind(this);
		this.currview = this.currview.bind(this);
		this.quizresult = this.quizresult.bind(this);
		this.quiztimer = this.quiztimer.bind(this);
		this.emit = this.emit.bind(this);
		this.pptready = this.pptready.bind(this);
		this.report = this.report.bind(this);
	}
		
		componentDidMount() {
					this.socket = io("http://" + window.location.hostname + PORT != '' ? (':'+PORT) : '');
					// event handlers
					this.socket.on('connect', this.connect);
					this.socket.on('welcome', this.updateState);
					this.socket.on('joined', this.joined);
					this.socket.on('audience', this.updateAudience);
					this.socket.on('start', this.start);
					this.socket.on('ask', this.ask);
					this.socket.on('results', this.updateResults);
					this.socket.on('end', this.updateState);
					this.socket.on('left', this.leftclient);
					this.socket.on('newuserreg', this.newuserreg);
					this.socket.on('disconnect', this.disconnect);
					this.socket.on('send_message',this.sendmessage);
					this.socket.on('RECEIVE_MESSAGE',this.recvmessage);
					this.socket.on('destroy', this.destroy);
					this.socket.on('currview', this.currview);
					this.socket.on('quizopts', this.quizresult);
					this.socket.on('timing',this.quiztimer);
					this.socket.on('pptready',this.pptready);
					this.socket.on('report',this.report);
				}

				
		connect() {
			// if this member is already in sessionStorage, then assign member ID in sessionStorage to this member; otherwise, do nothing
			var member = (localStorage.member) ? JSON.parse(localStorage.member) : null;
			if (member && member.type === 'audience') {
				this.emit('join', member);
				//console.log("member on reload "+member.regNumber);
			}
			
			else if (member && member.type === 'speaker') {
				this.emit('start', { name: member.name, title: sessionStorage.title });
			}
			
			this.setState({ status: 'connected' });
			
		}

		updateState(serverState) {
			this.setState(serverState);
			
		}

		joined(member) {
			localStorage.member = JSON.stringify(member);
			localStorage.hash= member.hash;
			localStorage.reg = member.regNumber;
			//console.log("new member LS ",member.ip);
			this.setState({ member: member });
			this.emit('newuser', member.regNumber);
			this.setState({ newuser: true });
			sessionStorage.ip=member.ip;
		}

		updateAudience(newAudience) {
			this.setState({ audience: newAudience });
		}
		
		start(presentation) {
			if (this.state.member.type === 'speaker') {
				sessionStorage.title = presentation.title;
				sessionStorage.ip=presentation.ip;
			}
			this.setState(presentation);
		}
		
		ask(question) {
			sessionStorage.answer = '';
			sessionStorage.mark = '';
			this.setState({ 
				currentQuestion: question,
				results: {a:0,b:0,c:0,d:0} ,
				startquiz : question.startquiz
			});
			//location.reload();
		}

		updateResults(data) {
			if(this.state.member.type === 'audience'){
			this.setState({ results: data.results, marks: data.marks });
			//console.log("state.marks ",this.state.marks.map(x=>x))
			var index = data.marks.findIndex(x=>x.user == localStorage.reg);
			//console.log("findindex index "+index);
			//console.log("data "+data.marks);
			this.setState({ usrmark : this.state.marks[index].mark }) 
			localStorage.mrk = this.state.marks[index].mark;
			console.log("usrmark this.state.marks[index].mark; ",this.state.marks[index].mark );
			//console.log("marks "+JSON.stringify(this.state.marks));
			//sessionStorage.usrmark=this.state.marks[index].mark;
			//console.log("sessionStorage "+sessionStorage.usrmark)
			//console.log("sessionStorage.reg "+sessionStorage.reg)
			}
		}

		leftclient(client){
			this.setState({ leftclients: client });
	
		}
	
		newuserreg(payload){
	this.setState({newuserreg: payload});
		}

		disconnect() {
			this.setState({ 
				status: 'disconnected',
				title: 'Server disconnected',
				speaker: '' 
			});
		}

		sendmessage(payload){
			this.setState({
				username: payload.username,
				message: payload.username,
				//messages: payload
			});
			this.emit('receive_message',payload);
			}
			
		recvmessage(payload){
		this.setState({
			messages:  payload
		})
		
		}

		destroy(payload){
			this.setState(payload);
			sessionStorage.clear();
			localStorage.clear();
			//console.log("local and session storage destroyed...");
		}

		currview(payload){
		 parent.location='/'+payload.ext;
		}
		report(payload){
			this.setState({report:payload})
		   }
		quizresult(payload){
			if(this.state.member.type === 'audience'){
			var index = payload.findIndex(x=>x.user == localStorage.reg);
			//console.log("payload[index] ",payload[index])
			//this.setState({ quizopts: { user:index, questions:payload[index] } });
			this.setState({ quizopts:payload[index].questions, quizhist: true});
			//console.log("xzxzx "+payload.map(s=>s))
			//onsole.log("payload[index].length "+ this.state.quizopts.questions.questions[0].question.q )
			//console.log("choice "+payload.questions[0].question.choice)
			//console.log("quizc "+payload.map((s) => console.log(s)))
		//console.log("ARRAY "+ payload[0].questions[0].question.q.toString());
			//this.state.quizopts.questions.questions.map((s)=>{console.log("question "+s.m)});
			//console.log("quizc "+this.state.quizopts.map((s) => console.log(s.question.q)));//.map((s) => console.log(s.q)));
		}
	}

		quiztimer(payload){
			this.setState({timer:payload, startquiz: payload.startquiz})
		}

		pptready(payload){
			this.setState({pptready: payload});
		}
		emit(event, payload) {
			this.socket.emit(event, payload);
		}


		render() {
			
			return(
		  <div className="container">
<Router>
{ (this.state.member.type === 'speaker') ? <div className="recorder"><Recorder/></div> :null }
{ (this.state.member.type === 'speaker') ? <Navbar emit={this.emit}/> :null }

<Header key={uuidv1()} emit={this.emit} {...this.state}/>
<Switch>
<Route exact path="/" render={()=><Audience emit={this.emit} {...this.state} />} />
<Route exact path="/speaker" render={()=><Selectppt emit={this.emit} {...this.state} />} />
<Route exact path="/quiz" render={()=><Speaker emit={this.emit} {...this.state} />} />
<Route exact path="/chat" render={()=><Rating emit={this.emit} {...this.state} />} />
<Route exact path="/review" render={()=><Review messages={ this.state.messages } />} />
<Route exact path="/notes" render={()=><Notes emit={this.emit} {...this.state}/>} />
<Route exact path="/slides" render={()=><PresentNotes {...this.state}/> }  />
<Route exact path="/questions" render={()=><Form emit={this.emit}/> }  />
<Route exact path="/results" render={()=><Quizopts quiz={ this.state.quizopts }  quizhist={ this.state.quizhist} />} />
<Route render={()=> <Whoops404 /> } />
</Switch>
</Router>
{ (this.state.newuser === true && typeof this.state.leftclients.regNumber === 'string') ? <ToastConnection {...this.state} /> :null }
		    </div>
			)
		}
	}

const root = document.getElementById('container');
root.setAttribute('notranslate',true);
	  ReactDOM.render(<Home />, root)
