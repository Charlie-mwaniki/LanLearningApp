import React from 'react';
import Display from './parts/Display';
import JoinSpeaker from './parts/JoinSpeaker';

export default class Selectppt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: []
    };
    this.getFile = this.getFile.bind(this);
  }
//https://ghibliapi.herokuapp.com/people
abortController = new AbortController();
getfiles = async () => {
  fetch("http://"+ sessionStorage.ip +":3000/api/files",{ 
    signal: this.abortController.signal ,
    headers:{ 
      "Content-Type": "text/plain"
    }
  })
    .then(response => response.json())
    .then(data => this.setState({ hits: data }));
}
componentWillMount(){
  this.getfiles();
  this.timer = setInterval( ()=> this.getfiles(), 5000 );
}
  componentDidMount() {
    $('#myModal').modal('show');
  }
  componentWillUpdate(prevprops){
    (prevprops !== this.props) ? this.getfiles() : null;
  }
  componentWillUnmount(){
    this.abortController.abort();
    this.timer = null;
  }

  rendertoast(){
    return(

<div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
<div className="modal-dialog modal-dialog-centered" role="document">
<div className="modal-content">
<div className="modal-header">
<h5 className="modal-title" id="exampleModalLongTitle">Message</h5>
<button type="button" className="close" data-dismiss="modal" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>
</div>
<div class="modal-body ">
{

  (this.props.pptready === true)
  ?
  <h4>The slides are ready...{this.props.pptready}</h4>
  :
<div className="row justify-content-center">
					<div className="text-center clearfix" role="alert">
						<div className="alert alert-primary justify-cont">
            Waiting for the slides to be ready...{this.props.pptready}
								</div>
                <div className="row"></div>
								<div className="spinner-border text-primary floatcenter2" role="status">
								<span className="sr-only">Loading...</span>
								</div>
								</div>
								</div>
}
</div>
</div>
</div>
</div>

    );
  }

  getFile(ev,name){
    ev.preventDefault();
    this.props.emit("fpath",name);
  }

  getExt(file){
    return file.slice((file.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  render() {
    const { hits } = this.state;
    const filter = hits.filter(item => {  return item.includes('ppt')  })
    return (

        <div className="container transition-item">
           <Display if={this.props.status === 'connected'}>
<Display if={this.props.member.name && this.props.member.type === 'speaker'}>
            <div className="col-md-12">
            <h3 className="d-block"><a>Current Directory</a>/</h3>
            <p className="d-block">Local Hard drive, Documents folder.</p>
            </div>
      
      <div className="col-md-12 text-wrap">
        {
          (hits.length>0) ?
          <ul className="list-group list-group-horizontal d-flex flex-wrap justify-content-between" >
          {filter.map((hit, index) =>
          
              <li className="list-group-item " key={index}>
                <div className="text-center text-wrap">
                <a className="pointer notes d-inline-block text-truncate" data-toggle="tooltip" data-placement="top" title="Share presentation (ppt only)" onClick={ ev => {this.getExt(hit) === 'ppt' || this.getExt(hit) === 'pptx' ? this.getFile(ev,hit) : null } } data-toggle="modal" data-target="#exampleModalCenter">
                {hit.replace(/.*[\/\\]/, '')}
                </a>
                </div>
              </li>
        )}
       </ul>
       :
       <div className="text-center pt30">
       <div className="spinner-border text-primary" role="status">
         <span className="sr-only">Loading...</span>
       </div>
     </div>
        }
        
         </div>
         </Display>
{(!this.props.member.name)?<JoinSpeaker emit={this.props.emit} />:null}

{this.rendertoast()}


        </Display>
         </div>
        

    );
  }
}
