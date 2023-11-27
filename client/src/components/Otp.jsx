import React, { useEffect } from 'react'
import { otp, setOtp, developement } from "../processes/userData"
import { useNavigate } from 'react-router-dom'

import '../Styles/Otp.css'
import OP from '../images/otp pic.jpg'
import LOGO from '../images/SAFE SYNC big.png'
import LOCK from '../images/lock.png'

function Otp() {
      const history = useNavigate();
      useEffect(() => {
            if (!otp.state) {
                  history('/login')
            }
      }, [])
      if (otp.state) {

            setTimeout(() => {
                  if (otp.state) {
                        alert("Otp Expired")
                        setOtp({
                              state: false
                        })
                        history("/Register")
                  }

            }, 58000);
            const CheckCode = async () => {
                  if (!document.getElementsByName('otp')[0].value) {
                        alert("Please enter the OTP")
                  }
                  else {
                        if (otp.userType === "ngo") {
                              try {
                                    const res = await fetch((developement ? 'http://localhost:5000/CheckCode' : '/CheckCode'), {
                                          method: "POST",
                                          headers: {
                                                "Content-Type": "application/json",
                                                Accept: "application/json",
                                                "Access-Control-Allow-Origin": "*",
                                          },
                                          body: JSON.stringify({
                                                otp: document.getElementsByName('otp')[0].value,
                                                nEmail: otp.nEmail,
                                                userType: otp.userType
                                          })
                                    })

                                    const data = await res.json();

                                    if (data.status === 406) {
                                          alert("Wrong Otp")
                                    }
                                    else if (data.status === 422) {
                                          alert("Already Authorized")
                                    }
                                    else if (data.status === 500) {
                                          alert("Internal server error")
                                    }
                                    else if (data.status === 200) {
                                          if (!otp.FP) {
                                                setOtp({
                                                      state: false
                                                })
                                                alert("Verified..!!")
                                                history("/Home")
                                          }
                                          else {
                                                alert("Verified..!!")
                                                history("/RP");
                                          }
                                    }
                                    else {
                                          throw Error;
                                    }
                              } catch (error) {
                                    console.error('Error:', error);
                                    alert("Unknown error")
                              }
                        }
                        else if (otp.userType === "branch") {
                              try {
                                    const res = await fetch((developement ? 'http://localhost:5000/CheckCode' : '/CheckCode'), {
                                          method: "POST",
                                          headers: {
                                                "Content-Type": "application/json",
                                                Accept: "application/json",
                                                "Access-Control-Allow-Origin": "*",
                                          },
                                          body: JSON.stringify({
                                                otp: document.getElementsByName('otp')[0].value,
                                                nEmail: otp.nEmail,
                                                userType: otp.userType,
                                                bEmail: otp.bEmail
                                          })
                                    })

                                    const data = await res.json();

                                    if (data.status === 406) {
                                          alert("Wrong Otp")
                                    }
                                    else if (data.status === 422) {
                                          alert("Already Authorized")
                                    }
                                    else if (data.status === 500) {
                                          alert("Internal server error")
                                    }
                                    else if (data.status === 200) {
                                          if (!otp.FP) {
                                                setOtp({
                                                      state: false
                                                })
                                                alert("Verified..!!")
                                                history("/Home")
                                          }
                                          else {
                                                alert("Verified..!!")
                                                history("/RP");
                                          }
                                    }
                                    else {
                                          throw Error;
                                    }
                              } catch (error) {
                                    console.log(error)
                                    alert("unknown error")
                              }
                        }
                        else {
                              alert("Unknown error")
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
                                                <div className="title">O.T.P. <br />Verification </div>
                                          </div>
                                          <img src={LOCK} className="LOCK" alt="lock" height="40px" width="40px" />
                                          <div className="sentence">Verification</div>
                                          <div className="submsg">Please enter the OTP code sent to your Email</div>
                                          <div className="decrease">
                                                <div className="input-container">
                                                      <input type="number" name="otp" placeholder='' />
                                                      <label>OTP</label>
                                                </div>
                                                <input onClick={CheckCode} type="button" value="Submit" className="Loginbtn" />
                                          </div>
                                    </div>
                              </div>
                              <div className="second part2">
                                    <img className='ss' src={OP} alt="ss" width="100%" height="90%" />
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

export default Otp