/* eslint-disable */
'use strict';
const path = require("path");
const http = require('http');
const express = require("express");
const cors = require('cors');
const socketIO = require('socket.io');
const _ = require('underscore');
const serveIndex = require('serve-index');
const crypto = require('crypto');
const fs = require('fs');
const open = require('open');
const fsextra = require('fs-extra')
const getppt = require('./components/Getimgs');
const os = require('os');
const ip = require('ip');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
var serverip = ip.address();
var serveslides=serveIndex('./assets/images');
var servefiles;
console.log("server ip "+serverip);
console.log("prc.cwd() "+process.cwd());
console.log("process.cwd()"+process.cwd());
console.log("path procexec "+path.dirname(process.execPath));
if(os.platform() == 'win32'){
	var name="C:\\Users\\"+os.userInfo().username+"\\Documents";
	console.log("server started documents "+name);
 servefiles=serveIndex(name);
} else if(os.platform() == 'linux' ){
	console.log("server started documents "+name);
	servefiles=serveIndex('/home/'+os.userInfo().username+'/Documents');
}

var servenotes=serveIndex('./assets');
var app = express();
var server = http.createServer(app);
var io = socketIO().listen(server);
const PORT = process.env.PORT || 3000;
(async () => {
// Specify app arguments.{app:'chromium'})
//await open('127.0.0.1:3000/speaker');
})();


var connections = [];
var title = 'LAN Learning';
var audience = [];
var speaker = {};
var currentQuestion = false;
var results = {
	a: 0,
	b: 0,
	c: 0,
	d: 0
};
var marks=0;
var rating;
var newuserreg=[];
var usermarks=[];
var messages = [];
var fd;
var serverUp=false;
const questions = require('./app-questions');
var questionss=[];
var quizopts = [];
var report = [];
var counter = 1;
var cattotals = 0;
app.use(cors());
//const webpack = require("webpack");
//const config = require("./webpack.config");
//var compiler = webpack(config);
//app.use(require("webpack-dev-middleware")(compiler, {publicPath: config.output.publicPath}));

//app.use(require("webpack-hot-middleware")(compiler));
const INDEX = path.join(__dirname, '/public','index.html');
app.get("/",(req, res) => res.sendFile(INDEX) );
app.get("/speaker",(req, res) => res.sendFile(INDEX) );
app.get("/quiz",(req, res) => res.sendFile(INDEX) );
app.get("/review",(req, res) => res.sendFile(INDEX) );
app.get("/chat",(req, res) => res.sendFile(INDEX) );
app.get("/notes",(req, res) => res.sendFile(INDEX) );
app.get("/slides",(req, res) => res.sendFile(INDEX) );
app.get("/results",(req, res) => res.sendFile(INDEX) );
app.get("/questions",(req, res) => res.sendFile(INDEX) );
//app.get("/report",(req, res) => res.sendFile(INDEX) );
app.get('/slide/:id', function(req, res){
	res.sendFile( path.join(process.cwd(), '/assets/images/'+req.params.id) );
  }); 
  app.get('/static/:id', function(req, res){
	console.log(req.params.id)
	res.sendFile( path.join(process.cwd(), '/assets/'+req.params.id) );
  }); 
app.get('/api/q/:id', function (req, res, next) {
	next()
  }, function (req, res, next) {
	  
(req.params.id <= Object.entries(questions).length && req.params.id > 0 ) ? res.send({"resp":questions[req.params.id-1],num:Object.entries(questions).length,id:req.params.id}) : res.send({"resp":""});
  });
//app.get("/:id",(req, res) => res.sendFile(INDEX) );
app.use('/api/slides', serveslides);
app.use('/api/files', servefiles);
app.use('/api/notes', servenotes);

//app.use('/static', express.static(path.join(process.cwd(), 'assets')))
app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Listening at "+serverip+":" + PORT);
});

var createHash = function(secret) {
	var cipher = crypto.createCipher('blowfish', secret);
	return(cipher.final('hex'));
};
var cryptoid = crypto.randomBytes(20).toString('hex');

io.sockets.on('connection', function (socket) {
	// add new socket ID to connections array
	connections.push(socket);
	// confirm new # of sockets connected
    console.log("Connected: %s sockets connected.", connections.length);

	socket.on('join', function(payload) { 
		var usm = usermarks.findIndex(x => x.user == payload.regNumber);  
		var index=audience.findIndex(x=>x.regNumber == payload.regNumber);
		console.log("usm ",usm)
		var usermark;
		if(usm === -1 && index === -1){
			//usermarks.push({user: payload.userreg, mark: 0  });
			usermark = 0;
		}else{
				//console.log("usermarks[index] ",usermarks[usm]) 
				usermark = usermarks[usm].mark ;
			
		}
		var newMember = {
			id: this.id,
			name: payload.name,
			regNumber: payload.regNumber,
			type: 'audience',
			mark:usermark,
			hash: cryptoid,
			ip: serverip
		};
		
		if(index === -1){
			this.emit('joined', newMember);
			audience.push(newMember);
		}
			io.sockets.emit('audience', audience);
			console.log("Audience Joined: %s sockid id %s ", payload.name, this.id);
	});

	socket.emit('welcome', {
		title: title,
		audience: audience,
		speaker: speaker.name,
		questions: questions,
		currentQuestion: currentQuestion,
		results: results,
		marks : marks
	});
	// listens for the "stthis.propsart" event (when the speaker joins)
	
	socket.on('start', function(payload) {
			speaker.name = payload.name
			speaker.id = this.id;
			speaker.type = 'speaker';
			title = payload.title;
			this.emit('joined', speaker);
			io.sockets.emit('start', { title: title, speaker: speaker.name, ip: serverip });
			db.defaults({ Cat: [] }).write();
			fs.writeFile("Attendance.txt","Student Name" +"\t"+ "Reg. Number" +"\t"+ "Quiz Marks"+"\n", "utf8", (err)=>{
				if(err) throw err;
			});
			fs.writeFile("Cat.txt","Student Name" +"\t"+ "Reg. Number" +"\t"+ "Cat One" +"\t"+ "Cat Two"+ "\t" + "Total"  +"\n", "utf8", (err)=>{
				if(err) throw err;
			});
			fs.writeFile("Feedback.txt","Student ID" +"\t"+"\t"+ "Comment"+"\n", "utf8", (err)=>{
				if(err) throw err;
			});

			fs.writeFile("Questions.txt","Question" +"\t\t\t"+ "choices (A,B,C,D)" +"\t\t\t\t"+ "marks"+ "\t\t\t"+ "correct" +"\n", "utf8", (err)=>{if(err) throw err;});
		
		console.log("Presentation Started: '%s' by %s", title, speaker.name);
	});

	socket.on('createquiz', function(payload){
		console.log(payload.q)
		fs.appendFileSync("Questions.txt",payload.q +"\t\t\t"+ payload.a +"\t"+ payload.b +"\t"+payload.c +"\t"+payload.d +"\t" + payload.m +"\t"+ payload.correct +"\n", "utf8");
		questions.push(payload);

	});

	socket.on('SEND_MESSAGE', function(payload){
		messages.push(payload);
        io.emit('RECEIVE_MESSAGE', messages);
    })

	socket.on('path', function(payload){
		socket.broadcast.emit('currview',payload);
	});
	
	socket.on('ask', function(question) {
		currentQuestion = question;
		results = {a:0, b:0, c:0, d:0};
		// broadcast the current question to*all* sockets
		socket.broadcast.emit('ask', currentQuestion);
		
	});
	// ON

	socket.on('multiplex-statechanged', function(data) {
			if (typeof data.secret == 'undefined' || data.secret == null || data.secret === '') return;
			if (createHash(data.secret) === data.socketId) {
				data.secret = null;
				socket.broadcast.emit(data.socketId, data);
			};
		});

	socket.on('answer', function(payload) {
		results[payload.choice]++;
		cattotals+=parseInt(payload.mark);
		console.log(cattotals)
		//(payload.question.correct === payload.choice) ? marks += payload.mark : marks = marks;
		//usermarks.add(JSON.stringify({user:userid.regNumber, marks:marks}));
		var index = usermarks.findIndex(x => x.user == payload.userreg);
		var user = audience.findIndex(x => x.regNumber == payload.userreg);
		//var rptq = report.findIndex(x => x.question == payload.question.q);
		//console.log("audience index ",user);
		//index === -1 ? usermarks.push({user:payload.userreg, mark:payload.mark}) : usermarks[index].mark += payload.mark;
		var ui = quizopts.findIndex(x => x.user == payload.userreg);
		//console.log("quizopts index ",ui);
		(ui === -1) ?
		 quizopts.push({user: payload.userreg,questions:[{ question:payload.question, choice: payload.question.correct,answer: payload.choice  }]}) : 
		 quizopts[ui].questions.push({ question:payload.question, choice: payload.question.correct,answer: payload.choice });
		//var ui = quizopts.findIndex(x => x.user == payload.userreg);
		//console.log("quizopts index ",ui);
		//(ui === -1) ? quizopts.push({user: payload.userreg}) : null;
		//check if answer is correct
		if(cryptoid === payload.uhash){

		if(payload.question.correct.toLowerCase()  === payload.choice.toLowerCase()){
			if(index === -1){
				usermarks.push({user: payload.userreg, mark: parseInt(payload.mark), total:cattotals});
				audience[user].mark = parseInt( payload.mark);
			}else{
				//console.log("usermarks[index].mark ",usermarks[index].mark)
				usermarks[index].mark += parseInt(payload.mark);
				
				audience[user].mark = parseInt(usermarks[index].mark) ;
			}
			io.sockets.emit('audience', audience);
		}else{
			if(index === -1){
				usermarks.push({user: payload.userreg, mark: 0  });
			}
			//usermarks[index].total = cattotals;
			
		}
	}
	    
		io.sockets.emit('results', {results:results, marks: usermarks, id:payload.userreg});
		io.sockets.emit('quizopts',quizopts);
		//io.sockets.emit('report',report);
		//console.log("report array %d rptq %d",report.length,rptq);
		//report.map(index=>{console.log("report ",index);});

	
		
	});

	socket.on('timer', function(payload) {
		io.sockets.emit('timing',payload);
	});
	socket.on('fpath', function(payload) {
		var file = payload.replace(/.*[\/\\]/, '');
		var dir = "./assets";

		var createfolder = function(path){
			//var r=fs.mkdirSync(path);
			const desiredMode = 0o2775
			var r=fsextra.ensureDirSync(dir,desiredMode);
			console.log("path to create "+path);
			console.log("fs.mkdirsync  "+r);
			//(r === "undefined") ? console.log("directory created" ): console.log("it didnt create");
			fs.copyFile(payload, "./assets/"+file, (err) => {
			  if (err) throw err;
			  var rd = getppt.init(file);
			  console.log("new promise ",rd)
			  var size = fs.stat(r,(err,stats)=>{if (err) throw err; return stats.size;})
			  
			  if(rd){
				  console.log(" rd succ ");
				io.sockets.emit('pptready',true);
			  }else{
				console.log(" rd fail ");
				io.sockets.emit('pptready',"An error occurred...");
			  }
			
			  console.log(file+" was copied to /assets/ directory");
			});
		}
		
		try {
			if (fs.existsSync(dir)){
				fsextra.removeSync(dir);
				console.log(dir+" is Removed");
				fsextra.removeSync("./assets");
				
			}
			if(!fs.existsSync(dir)){
				createfolder(dir);	
				//fsextra.remove(process.cwd()+"/public/images/"+file, err => {console.error(err) });	
			}
		  } catch (err) {
			console.error(err)
		  }	
	});
	socket.on('file', function(payload) {
		fs.copyFile(payload, payload, (err) => {
			if (err) throw err;
			console.log('source.txt was copied to destination.txt');
		  });
		
	});
	socket.on('newuser', function(payload) {
		newuserreg=payload;
		io.sockets.emit('newuserreg', payload);
	});

	socket.on('drawing', function(payload){
		socket.broadcast.emit('drawing', payload);
	});

	async function Savetofile(){

			await audience.map((index,key) =>{
				key=key+1;
				const umark = db.get('Cat').find({ user: index.regNumber }).value();
				var sum,grandtotal ;
				console.log("cattotals ",cattotals)
				if(umark && umark.mark !==null && umark.total !== null ){
					sum = parseInt(index.mark)+parseInt(umark.mark);
					grandtotal = umark.total+cattotals;
					fs.appendFileSync("Cat.txt",key+" "+index.name +"\t\t"+ index.regNumber +"\t\t"+ umark.mark+ "/"+umark.total + "\t\t"+ index.mark+ "/"+cattotals + "\t\t" + sum+"/"+grandtotal + "\n", "utf8");
				}else{
					sum = 0;
					fs.appendFileSync("Cat.txt",key+" "+index.name +"\t\t"+ index.regNumber +"\t\t"+ index.mark + "/"+ cattotals  + "\t\t"+ "0" + "\t\t" + sum + "\n", "utf8");
				} 
				fs.appendFileSync("Attendance.txt",key+" "+index.name +"\t\t"+ index.regNumber +"\t"+ index.mark +"\n", "utf8");
			});

			await usermarks.map(index =>{
				db.get('Cat')
				.push(index)
				.write()
			});
			
			return true;
	}

	socket.on('clearsession',function(){

		usermarks.map( (value,index) => {
		//	usermarks[index].total = cattotals;
		console.log("marks ", value);
		})

		for( var i=0;i<usermarks.length;i++){
			usermarks[i].total = cattotals;
		}


if(Savetofile()){
	console.log("File saved");
}else{
	console.log("Error");
}

messages.map(index =>{
	fd = fs.appendFileSync("Feedback.txt",index.author +"\t\t"+ index.message +"\n", "utf8");
});

	console.log("Server initiated total shutdown...");
	socket.broadcast.emit('destrony',{
		title : "Session has ended...",
		member: {},
		audience: [],
		speaker: '',
		marks: []
	});
	console.log("Server stopped, Bye");
	//io.close();
	});

	socket.once('disconnect', function() {
		var member = _.findWhere(audience, { id: this.id });

		if (member) {
			audience.splice(audience.indexOf(member), 1);
			io.sockets.emit('audience', audience);
			io.sockets.emit('left', {name: member.name, regNumber: member.regNumber});
			//console.log("Left: %s regnumber %s (%s audience members)", member.name, member.regNumber, audience.length);
		}
		// if the socket ID emitting the "disconnect" event is NOT found in the "audience" array, then it must be the speaker's socket
	
		else if (this.id === speaker.id) {
			//console.log("%s has left. '%s' is over.", speaker.name, title);
			speaker = {};
			title = "Session has ended....";
			io.sockets.emit('end', { title: title, speaker: '' });
		}
		connections.splice(connections.indexOf(socket), 1);

		socket.disconnect();
		// confirm socket has disconnected
		console.log("Disconnected: %s sockets remaining.", connections.length);
	});



});
