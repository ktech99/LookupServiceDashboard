import React from "react";
import { Marker } from "react-google-maps";
// import StethoscopeIcon from "../stethoscopeIcon.png";
import dot from "../image/dot.png"
import {InfoWindow } from 'react-google-maps'


export default class Mark extends React.Component {

  constructor(){
    super();
    this.state={
      isOpen: false
    }
    this.onToggle = this.onToggle.bind(this);
  }

 onToggle(){
  this.setState({isOpen: !this.state.isOpen})
 }
  render(){
    return(
        <Marker
          position={this.props.location}
          icon={dot}
          onClick={this.onToggle}
        >
          {this.state.isOpen && 
                <InfoWindow onCloseClick={this.onToggle}>
                    <div>Open</div>
                </InfoWindow>}
        </Marker>
    );
  }
}