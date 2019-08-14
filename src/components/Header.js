import React, {Component} from 'react';
import logo from '../image/Logo.png';
import '../styles/Header.css';

class Header extends Component{
  constructor(){
    super();
    this.state = {
      
    }
  }

  render() {
    return (
        <div className="App-header">
          {/* Header div */}
          <img src = {logo} className = "Header-logo" alt="perfSONAR logo"></img>
          <h1 className ="Header-heading">Lookup Service Directory</h1>
          {/* Todo: add search */}
          <hr></hr>
        </div>
    );
  }

};

export default Header;