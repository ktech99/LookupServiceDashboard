import React, { Component } from 'react'
import { compose, withProps } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker,InfoWindow } from 'react-google-maps'

const google = window.google;

const MapWithMarkers = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAEW46KVttk6w0Ik_-hKNl7XqQ31t07q0U&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `50vh` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        defaultZoom={13}
        defaultCenter={{ lat: 42.3381437, lng: -71.0475773 }}>
        {/* Todo loop this */}
        <MarkerWithInfoWindow position={{ lat: 42.3381437, lng: -71.0475773 }} content="South Boston" />
        <MarkerWithInfoWindow position={{ lat: 42.3875968, lng: -71.0994968 }} content="Somervil" />

    </GoogleMap>
);


class MarkerWithInfoWindow extends React.Component {

    constructor() {
        super();
        this.state = {
            isOpen: false
        }
        this.onToggleOpen = this.onToggleOpen.bind(this);
    }

    onToggleOpen() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (<Marker
            position={this.props.position}
            onClick={this.onToggleOpen}>
            {this.state.isOpen && <InfoWindow onCloseClick={this.onToggleOpen}>
                <h3>{this.props.content}</h3>
            </InfoWindow>}
        </Marker>)
    }
}

export default MapWithMarkers;