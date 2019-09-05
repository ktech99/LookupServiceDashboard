import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import React, { Component } from 'react';
import Mark from "./Mark";
import dot from "../image/dot.png"

const Map = withScriptjs(withGoogleMap((props) => {

    const markers = (props.hostResults.length === 0 ? props.all.map(coord => <Mark
      key={Math.random()}
      location={{ lat: parseFloat(coord.latitude), lng: parseFloat(coord.longitude) }}
      host={coord["Host Name"]}
      hostUri={coord["URI"]}
      callback={props.chooseHostCallback}
      icon={dot}
    />)
      :
      props.hostResults.map(coord => <Mark
        key={Math.random()}
        location={{ lat: parseFloat(coord.latitude), lng: parseFloat(coord.longitude) }}
        host={coord["Host Name"]}
        hostUri={coord["URI"]}
        callback={props.chooseHostCallback}
        icon={dot}
      />));
    return (
      <GoogleMap
        defaultZoom={3}
        center={{ lat: 37.8715, lng: 122.2730 }}
      >
        {markers}
      </GoogleMap>
    );
  }
  ))


  export default class Mapper extends React.PureComponent {

    render() {
        return (
            <Map
            lat={this.props.lat}
            long={this.props.long}
            all={this.props.all}
            hostResults={this.props.hostResults}
            chooseHostCallback={this.chooseHostCallback}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAEW46KVttk6w0Ik_-hKNl7XqQ31t07q0U&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `600px`, width: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        );
    }
}