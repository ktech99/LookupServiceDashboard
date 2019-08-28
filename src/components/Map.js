import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import Mark from "./Mark";

const Map = withScriptjs(withGoogleMap((props) =>{

//   const markers = props.doctors.map( doctor => <DoctorMarker
//                     key={doctor.uid}
//                     doctor={doctor}
//                     location={{lat: doctor.closestPractice.lat, lng: doctor.closestPractice.lon}}
//                   />);
                  
  return (
      <GoogleMap
        defaultZoom={14}
        center={ { lat:  42.3601, lng: -71.0589 } }
        >
            <Mark
                    key={1}
                    doctor={2}
                    location={{lat: 42.3601, lng: -71.0589}}
                  />
        
      </GoogleMap>
    );
  }
))

export default Map;