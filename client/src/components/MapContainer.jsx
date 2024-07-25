import { useState, useEffect } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { setOtp, loginUser, otp } from '../processes/userData';

const MapContainer = (props) => {
      const [markerPosition, setMarkerPosition] = useState({
            lat: (loginUser.bCoordinates.substring(0, (loginUser.bCoordinates).indexOf(',')) === "0") ? 28 : Number(loginUser.bCoordinates.substring(0, (loginUser.bCoordinates).indexOf(','))),
            lng: (Number(loginUser.bCoordinates.substring((loginUser.bCoordinates).indexOf(',') + 1)) === 0) ? 77 : Number(loginUser.bCoordinates.substring((loginUser.bCoordinates).indexOf(',') + 1))
      });
      useEffect(() => {
            setOtp({
                  state: false,
                  coordinates: loginUser.bCoordinates
            })
      }, [])
      const onMarkerDragend = (markerProps, marker, newCoords) => {
            // Update the marker's position after dragging
            setMarkerPosition(newCoords.latLng.toJSON());
            setOtp({
                  state: false,
                  coordinates: newCoords.latLng.toJSON().lat + ", " + newCoords.latLng.toJSON().lng
            })
      };

      const mapStyles = {
            width: '100%',
            height: '100%'
      };

      return (
            <Map
                  google={props.google}
                  zoom={8}
                  style={mapStyles}
                  initialCenter={{
                        lat: (loginUser.bCoordinates.substring(0, (loginUser.bCoordinates).indexOf(',')) === "0") ? 28 : Number(loginUser.bCoordinates.substring(0, (loginUser.bCoordinates).indexOf(','))),
                        lng: (Number(loginUser.bCoordinates.substring((loginUser.bCoordinates).indexOf(',') + 1)) === 0) ? 77 : Number(loginUser.bCoordinates.substring((loginUser.bCoordinates).indexOf(',') + 1))
                  }}
            >
                  <Marker
                        draggable
                        onDragend={onMarkerDragend}
                        position={markerPosition}
                        title={'Your Branch'}
                        name={'Your Branch'}
                  />
            </Map>
      );
};

export default GoogleApiWrapper({
      apiKey: 'AIzaSyDUg2J6gtEw5-VtXCaQ6eWWhbJuByQP-ig'
})(MapContainer);