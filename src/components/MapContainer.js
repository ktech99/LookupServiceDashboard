import React from "react";
import Map from "./Map";

export default class MapContainer extends React.Component {

	constructor(props) {
		super(props);
		console.log(props)
		
	  }

	render() {
		return (
			<Map
				doctors={this.props.doctors}
				googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAEW46KVttk6w0Ik_-hKNl7XqQ31t07q0U&v=3.exp&libraries=geometry,drawing,places`}
				loadingElement={<div style={{ height: `100%` }} />}
				containerElement={<div style={{ height: `600px`, width: `600px`}} />}
				mapElement={<div style={{ height: `100%` }} />}
			/>
		);
	}
}