// Import ReactcomponentWillUnmount
import React from 'react';
import axios from 'axios';
import Join from './parts/Join';
export default class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: [],
    };
    this.getFile = this.getFile.bind(this);
  }
abortController = new AbortController();
getnotes = async () => {
  fetch("http://"+ sessionStorage.ip +":3000/api/notes",{ 
    signal: this.abortController.signal ,
    headers:{ 
      "Content-Type": "text/plain"
    }
  })
    .then(response => response.json())
    .then(data => this.setState({ hits: data }));
}
  componentDidMount() {
    this.getnotes(); 
    this.timer = setInterval( ()=> {
      this.getnotes();
    }, 5000 );
   // this.reload = setInterval(()=>location.reload(true),1000);
  }
 
  componentWillUnmount(){
    this.abortController.abort();
    clearInterval(this.timer);	
   // clearInterval(this.reload);	
    this.timer = null;
    //this.reload = null;
  }

  getFile(ev,name){
    ev.preventDefault();
    name=name.replace(/.*[\/\\]/, '');
    axios({
      url: "http://"+ window.location.hostname +":3000/static/"+name,
      method: "GET",
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
    });
    
  }

  getExt(file){
    return file.slice((file.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  render() {
    const { hits } = this.state;
    const filter = hits.filter(item => {  return item.includes('ppt')  })
    return (

        <div className="container">
            <div className="row">
            <h3><a>Current Class Notes</a>/</h3>
            </div>
      
        {
           
           (hits.length>0) ?
           <div className="row text-wrap">
<ul className="list-group list-group-horizontal d-flex flex-wrap justify-content-between" >
          { filter.map((hit, index) =>
              <li className="list-group-item " key={index}>
                <div className="text-center text-wrap">
                <a className="pointer notes d-inline-block text-truncate" data-toggle="tooltip" data-placement="top" title="Download ppt" onClick={ ev => {this.getExt(hit) === 'ppt' || this.getExt(hit) === 'pptx'  ? this.getFile(ev,hit) : null } } >
                {hit.replace(/.*[\/\\]/, '')}
                </a>
                </div>
              </li>
        )
        }
       </ul>
       </div>
       :
<div className="row justify-content-center">
					<div className="text-center clearfix" role="alert">
						<div className="alert alert-primary justify-cont">
								Waiting for the teacher to share the notes...
								</div>
								<div className="spinner-border text-primary floatcenter2" role="status">
								<span className="sr-only">Loading...</span>
								</div>
								</div>
								</div>
        }
               
         </div>
         
    );
  }
}
