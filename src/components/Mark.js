import React from "react";
import { Marker } from "react-google-maps";
// import StethoscopeIcon from "../stethoscopeIcon.png";
import dot from "../image/dot.png"
import {InfoWindow } from 'react-google-maps'
import { thisExpression } from "@babel/types";


export default class Mark extends React.Component {

  constructor(){
    super();
    this.state={
      isOpen: false
    }
    this.onToggle = this.onToggle.bind(this);
    this.getServiceType = this.getServiceType.bind(this);
  }

 onToggle(){
  this.setState({isOpen: !this.state.isOpen})
 }

 getServiceType(hostName){
  fetch('http://localhost:8080/getTypeOfServiceHost?hosts='+hostName.hostName, { headers: { 'Access-Control-Allow-Origin': "http://127.0.0.1:3000" } })
      .then(res => res.json())
      .then((data) => {
        console.log(data)
        return null;
      })
      .catch(console.log)
      return null;
     
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
                    <div><b>{this.props.host}</b>
                    <this.getServiceType hostName = {this.props.hostUri}/>
                    </div>
                    
                </InfoWindow>}
        </Marker>
    );
  }
}