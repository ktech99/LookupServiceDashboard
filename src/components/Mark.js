import React from "react";
import { Marker } from "react-google-maps";
// import StethoscopeIcon from "../stethoscopeIcon.png";
import dot from "../image/dot.png"

export default class Mark extends React.Component {

  render(){
    return(
        <Marker
          position={this.props.location}
        icon={dot}
        >
        </Marker>
    );
  }
}