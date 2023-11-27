import React, { useEffect } from 'react'
import { otp, setOtp, developement } from "../processes/userData"
import { useNavigate } from 'react-router-dom'

import LOGO from '../images/SAFE SYNC big.png'
import RP from '../images/RP.jpg'

function ResetPassword() {
      const history = useNavigate();
      useEffect(() => {
            if (!otp.state) {
                  history('/login')
            }
      }, [])
      if (otp.state) {
            const ChangePassword = async (e) => {
                  const password = document.getElementsByName("password")[0].value;
                  const cpass = document.getElementsByName("password")[1].value;
                  if (!password || !cpass) {
                        alert('Please fill all fields properly');
                  }
                  else if (password !== cpass) {
                        alert('both passwords are different')
                  }
                  else {
                        try {
                              const res = await fetch((developement ? 'http://localhost:5000/ChangePassword' : '/ChangePassword'), {
                                    method: "POST",
                                    headers: {
                                          "Content-Type": "application/json",
                                          Accept: "application/json",
                                          "Access-Control-Allow-Origin": "*",
                                    },
                                    body: JSON.stringify({
                                          nEmail: otp.nEmail,
                                          bEmail: otp.bEmail,
                                          password,
                                          userType: otp.userType
                                    })
                              })

                              const data = await res.json();

                              if (data.status === 406) {
                                    alert("Fill the Fields properly")
                              }
                              else if (data.status === 409) {
                                    alert("Entered Password is same as current password")
                              }
                              else if (data.status === 500) {
                                    alert("Internal server error")
                              }
                              else if (data.status === 200) {
                                    setOtp({
                                          state: false
                                    })
                                    alert("Password Changed Successfully..!!")
                                    history("/login")
                              }
                              else {
                                    throw Error;
                              }
                        } catch (error) {
                              console.log(error)
                        }
                  }
            }
            return (
                  <>
                        <div className="main">
                              <div className="first part1">
                                    <div className="innerpart">
                                          <div className="starter">
                                                <img src={LOGO} alt="logo" className="LOGO" />
                                                <div className="title">Reset <br />Password </div>
                                          </div>
                                          <div className="input-container">
                                                <input type="password" name="password" placeholder='' />
                                                <label>Password</label>
                                          </div>
                                          <div className="input-container">
                                                <input type="password" name="password" placeholder='' />
                                                <label>Confirm Password</label>
                                          </div>
                                          <input type="button" onClick={ChangePassword} className='Loginbtn' value="Change Password" />
                                    </div>
                              </div>
                              <div className="second part2">
                                    <img className='ss' src={RP} alt="ss" width="100%" height="100%" />
                              </div>
                        </div>

                  </>
            )
      }
      else {
            return (
                  <>Error</>
            )
      }

}

export default ResetPassword