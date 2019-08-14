import React, {Component} from 'react';
import '../styles/Sidebar.css';

class Sidebar extends Component{
  constructor(){
    super();
    this.state = {
      results: {}
    }
  }

  render() {
    return (
        <div className= "App-sidebar">
            <button>Browse</button>
            <button>Community</button>
            <button>Deveoper</button>
        </div>
    );
  }

};

export default Sidebar;