import React, { useState, useEffect } from 'react'
import { loginUser, developement, getOtp } from '../processes/userData';
import Cookies from 'universal-cookie';
// import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

import LOGO from '../images/SAFE SYNC big.png';
import AU from "../images/AU.jpg"
import P from '../images/p.png'

import Map from '../components/MapContainer'

import '../Styles/AU.css'


function AccountUpdate() {
      const cookie = new Cookies();
      // const [markerPosition, setMarkerPosition] = useState({
      //       lat: (loginUser.bCoordinates.substring(0, (loginUser.bCoordinates).indexOf(',')) === "0") ? 28 : Number(loginUser.bCoordinates.substring(0, (loginUser.bCoordinates).indexOf(','))),
      //       lng: (Number(loginUser.bCoordinates.substring((loginUser.bCoordinates).indexOf(',') + 1)) === 0) ? 77 : Number(loginUser.bCoordinates.substring((loginUser.bCoordinates).indexOf(',')))
      // });
      // const onMarkerDragend = (markerProps, marker, newCoords) => {
      //       // Update the marker's position after dragging

      //       setMarkerPosition(newCoords.latLng.toJSON());

      //       loginUser.bCoordinates = markerPosition.lat + ", " + markerPosition.lng

      // };

      if (loginUser) {
            // const MapContainer = (props) => {

            //       const mapStyles = {
            //             width: '100%',
            //             height: '100%'
            //       };

            //       return (
            //             <Map
            //                   google={props.google}
            //                   zoom={8}
            //                   style={mapStyles}
            //                   initialCenter={{
            //                         lat: (loginUser.bCoordinates.substring(0, (loginUser.bCoordinates).indexOf(',')) === "0") ? 28 : Number(loginUser.bCoordinates.substring(0, (loginUser.bCoordinates).indexOf(','))),
            //                         lng: (Number(loginUser.bCoordinates.substring((loginUser.bCoordinates).indexOf(',') + 1)) === 0) ? 77 : Number(loginUser.bCoordinates.substring((loginUser.bCoordinates).indexOf(',') + 1))
            //                   }}
            //             >
            //                   <Marker
            //                         draggable
            //                         onDragend={onMarkerDragend}
            //                         position={markerPosition}
            //                         title={'Your Branch'}
            //                         name={'Your Branch'}
            //                   />
            //             </Map>
            //       );
            // };

            // const Mapp = GoogleApiWrapper({
            //       apiKey: 'AIzaSyDUg2J6gtEw5-VtXCaQ6eWWhbJuByQP-ig'
            // })(MapContainer);
            const Submit = async () => {
                  try {
                        if (cookie.get("userType") === "ngo") {
                              const res = await fetch((developement ? 'http://localhost:5000/UpdateNgo' : '/UpdateNgo'), {
                                    method: "POST",
                                    headers: {
                                          "Content-Type": "application/json",
                                          Accept: "application/json",
                                          "Access-Control-Allow-Origin": "*",
                                    },
                                    body: JSON.stringify({
                                          email: loginUser.nEmail,
                                          name: document.getElementsByName("name")[0].value,
                                          contact: document.getElementsByName("contact")[0].value,
                                          expertise: document.getElementsByName("expertise")[0].value
                                    })
                              })

                              const data = await res.json();

                              if (data.status === 500) {
                                    alert("Internal server error")
                              }
                              else if (data.status === 200) {
                                    alert("Updated Successfully !")
                              }
                        }
                        else {
                              const res = await fetch((developement ? 'http://localhost:5000/UpdateBranch' : '/UpdateBranch'), {
                                    method: "POST",
                                    headers: {
                                          "Content-Type": "application/json",
                                          Accept: "application/json",
                                          "Access-Control-Allow-Origin": "*",
                                    },
                                    body: JSON.stringify({
                                          bEmail: loginUser.bEmail,
                                          nEmail: loginUser.nEmail,
                                          name: document.getElementsByName("name")[0].value,
                                          contact: document.getElementsByName("contact")[0].value,
                                          expertise: document.getElementsByName("expertise")[0].value,
                                          address: document.getElementsByName("address")[0].value,
                                          services: document.getElementsByName("services")[0].value,
                                          coordinates: getOtp().coordinates
                                    })
                              })
                             
                              const data = await res.json();

                              if (data.status === 500) {
                                    alert("Internal server error")
                              }
                              else if (data.status === 200) {
                                    alert("Updated Successfully !")
                              }
                        }
                  } catch (error) {
                        console.log(error)
                  }
            }
            const Decide = () => {
                  if (cookie.get("userType") === "ngo") {
                        return (
                              <>
                                    <div className="input-container1">
                                          <input type="email" name='email' placeholder='' value={loginUser.nEmail} readOnly />
                                          <label>Email address</label>
                                    </div>
                                    <div className="input-container1">
                                          <input type="text" name='name' placeholder='' defaultValue={loginUser.nName} />
                                          <label>Name</label>
                                    </div>
                                    <div className="input-container1">
                                          <input type="text" name='contact' placeholder='' defaultValue={loginUser.nContact} />
                                          <label>Contact No.</label>
                                    </div>
                                    <div className="input-container1">
                                          <input type="text" name='expertise' placeholder='' defaultValue={loginUser.nExpertise} />
                                          <label>Expertise</label>
                                    </div>
                              </>
                        )
                  }
                  else {
                        return (
                              <>
                                    <div className="input-container1">
                                          <input type="email" name='nEmail' placeholder='' value={loginUser.nEmail} readOnly />
                                          <label>NGO Email</label>
                                    </div>
                                    <div className="input-container1">
                                          <input type="email" name='bEmail' placeholder='' value={loginUser.bEmail} readOnly />
                                          <label>Email address</label>
                                    </div>
                                    <div className="input-container1">
                                          <input type="text" name='name' placeholder='' defaultValue={loginUser.bName} />
                                          <label>Name</label>
                                    </div>
                                    <div className="input-container1">
                                          <input type="text" name='contact' placeholder='' defaultValue={loginUser.bContact} />
                                          <label>Contact No.</label>
                                    </div>
                                    <div className="input-container1">
                                          <input type="text" name='expertise' placeholder='' defaultValue={loginUser.bExpertise} />
                                          <label>Expertise</label>
                                    </div>
                                    <div className="input-container1">
                                          <input type="text" name='address' placeholder='' defaultValue={loginUser.bAddress} />
                                          <label>Address</label>
                                    </div>
                                    <div className="input-container1">
                                          <input type="text" name='services' placeholder='' defaultValue={loginUser.bServices} />
                                          <label>Services</label>
                                    </div>
                                    <div className="map">
                                          <Map />
                                    </div>
                              </>
                        )
                  }
            }
            return (
                  <div className='parent'>
                        <div className="main">
                              <div className="first part1">
                                    <div className="innerpart">
                                          <div className="starter">
                                                <img src={LOGO} alt="logo" className="LOGO" />
                                                <div className="title">Account<br />Update </div>
                                          </div>
                                          <img className='PP' src={P} alt="profile pic" width="100px" height="100px" />
                                          <div className="form1">
                                                <Decide />
                                                <br />
                                                <input onClick={Submit} className='Loginbtn' type="button" value="Save Changes" />
                                          </div>

                                    </div>
                              </div>
                              <div className="second part2">
                                    <img className='ss' src={AU} alt="ss" width="100%" height="100%" />
                              </div>
                        </div>
                  </div>
            )
      }
      else {
            return (
                  <>Error</>
            )
      }

}

export default AccountUpdate