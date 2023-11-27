import React, { useState, useEffect } from 'react'
import { developement, setIsLoggedIn } from '../processes/userData.jsx'
import Cookies from 'universal-cookie'
import {useNavigate, NavLink} from 'react-router-dom'

import '../Styles/Login.css'
import SS from '../images/SAFE SYNC.jpg'
import SN from '../images/SAFE SYNC NGO.png'
import SB from '../images/SAFE SYNC BRANCH.png'

function Login() {
      const history = useNavigate();
      const cookie = new Cookies();
      const [NorB, setnorb] = useState(0);
      const [ngo, setngo] = useState("");
      const [ngos, setngos] = useState([]);
      const [inputValues, setInputValues] = useState({
            email: "", password: ""
      });
      useEffect(() => {

            fetchData()
            document.getElementById(`${NorB}`).style.opacity = 1;
            document.getElementById(`${NorB === 0 ? 1 : 0}`).style.opacity = 0.5
      }, [NorB, ngo])
      const Handle = (event) => {
            const { name, value } = event.target;
            setInputValues({ ...inputValues, [name]: value });
      }
      const Login = async () => {
            try {
                  if (NorB === 0) {
                        if (!inputValues.email || !inputValues.password) {
                              alert("fill the fields properly")
                        }
                        else if (!inputValues.email.includes('@')) {
                              alert("Insert a valid email")
                        }
                        else {
                              try {
                                    const res = await fetch((developement ? 'http://localhost:5000/ngoLogin' : '/ngoLogin'), {
                                          method: "POST",
                                          headers: {
                                                "Content-Type": "application/json",
                                                Accept: "application/json",
                                                "Access-Control-Allow-Origin": "*",
                                          },
                                          body: JSON.stringify({
                                                email: inputValues.email, password: inputValues.password
                                          })
                                    })

                                    const data = await res.json();

                                    if (data.status === 406) {
                                          alert("Fill the fields properly")
                                    }
                                    else if (data.status === 417) {
                                          alert("Incorrect email or password")
                                    }
                                    else if (data.status === 401) {
                                          alert("Your OTP verification is pending")
                                    }
                                    else if (data.status === 402) {
                                          alert("Authorization by admin is pending")
                                    }
                                    else if (data.status === 500) {
                                          alert("Internal server error")
                                    }
                                    else if (data.status === 202) {
                                          setIsLoggedIn(true);
                                          history("/Home")
                                          if (document.getElementById('remember').checked) {
                                                cookie.set("Token", data.token, { maxAge: 3.154e+10 })
                                                cookie.set("userType", "ngo", { maxAge: 3.154e+10 })
                                          }
                                          else {
                                                cookie.set("Token", data.token)
                                                cookie.set("userType", "ngo")
                                          }
                                          alert("Login Successful")
                                    }
                                    else {
                                          throw Error;
                                    }
                              } catch (error) {
                                    console.error('Error:', error);
                                    alert("Unknown error")
                              }
                        }
                  }
                  else if (NorB === 1) {
                        if (ngo === "") {
                              alert("Please Select a NGO")
                        }
                        else if (!inputValues.email || !inputValues.password) {
                              alert("fill the fields properly")
                        }
                        else if (!inputValues.email.includes('@')) {
                              alert("Insert a valid email")
                        }
                        else {
                              try {
                                    const res = await fetch((developement ? 'http://localhost:5000/bLogin' : '/bLogin'), {
                                          method: "POST",
                                          headers: {
                                                "Content-Type": "application/json",
                                                Accept: "application/json",
                                                "Access-Control-Allow-Origin": "*",
                                          },
                                          body: JSON.stringify({
                                                nEmail: ngo, bEmail: inputValues.email, password: inputValues.password
                                          })
                                    })

                                    const data = await res.json();

                                    if (data.status === 406) {
                                          alert("Fill the fields properly")
                                    }
                                    else if (data.status === 417) {
                                          alert("Incorrect email or password")
                                    }
                                    else if (data.status === 401) {
                                          alert("Your OTP verification is pending")
                                    }
                                    else if (data.status === 402) {
                                          alert("Authorization by admin is pending")
                                    }
                                    else if (data.status === 500) {
                                          alert("Internal server error")
                                    }
                                    else if (data.status === 202) {
                                          setIsLoggedIn(true);
                                          history('/Home')
                                          if (document.getElementById('remember').checked) {
                                                cookie.set("Token", data.token, { maxAge: 3.154e+10 })
                                                cookie.set("userType", "branch", { maxAge: 3.154e+10 })
                                          }
                                          else {
                                                cookie.set("Token", data.token)
                                                cookie.set("userType", "branch")
                                          }

                                          alert("Login Successful")
                                    }
                                    else {
                                          throw Error;
                                    }
                              } catch (error) {
                                    console.error('Error:', error);
                                    alert("Unknown error")
                              }
                        }
                  }
            }
            catch (e) {
                  console.log(e)
                  alert("Unknown error")
            }
      }
      const change = (e) => {
            if (Number(e.target.id) === 0) {
                  if (NorB !== 0) {
                        setnorb(0);
                  }
            }
            else {
                  if (NorB !== 1) {
                        setnorb(1);
                  }
            }
      }
      const fetchData = async () => {
            try {
                  const res = await fetch((developement ? 'http://localhost:5000/GetNgoList' : '/GetNgoList'), {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json",
                              Accept: "application/json",
                              "Access-Control-Allow-Origin": "*",
                        }
                  })

                  const data = await res.json();
                  if (data.state === 500) {
                        alert("Internal server error")
                  }
                  else {
                        setngos(data.data);
                  }

            } catch (error) {
                  console.error('Error:', error);
                  // alert("Unknown error occured")
            }
      }

      const Decide = () => {
            if (NorB === 1) {
                  return (
                        <>
                              <div className="selector" onMouseOut={() => { document.getElementsByClassName("dropdown-content")[0].style.display = "none"; }} onMouseOver={() => { document.getElementsByClassName('dropdown-content')[0].style.display = "block" }}>
                                    <input className='DD' type="button" value={(ngo === "") ? "Select Ngo" : "Ngo selected"} />

                                    <div className="dropdown-content">
                                          {ngos.map(mapit)}
                                    </div>
                              </div>
                        </>
                  )
            }
            else {
                  return (
                        <></>
                  )
            }
      }
      const set = (e) => {
            setngo(e.target.id)
            document.getElementsByClassName("dropdown-content")[0].style.display = "none";
      }
      const mapit = (e) => {
            if (e.nEmail === ngo) {
                  return (
                        <div key={e.nEmail} className="selected">{e.nName}</div>
                  )
            }
            else {
                  return (
                        <div key={e.nEmail} id={e.nEmail} onClick={set}>
                              {e.nName}
                        </div>
                  )
            }

      }
      return (
            <div className='main'>
                  <div className="first half">
                        <div className='innerFirst'>
                              <div className='hello'>Hello,</div>
                              <div className='wb'> welcome back! </div>
                              <img id="0" onClick={change} className='sn' src={SN} alt="sn" width="100px" height="100px" />
                              <img id="1" onClick={change} src={SB} alt="SB" className="sn" width="100px" height="100px" />

                              <div className="form">
                                    <Decide />
                                    <div className="input-container">
                                          <input type="email" name='email' onChange={Handle} placeholder='' />
                                          <label>Email address</label>
                                    </div>
                                    <div className="input-container">
                                          <input type="password" name='password' onChange={Handle} placeholder='' />
                                          <label>Password</label>
                                    </div>
                                    <input type="checkbox" id="remember" />
                                    <span className="FP"><NavLink to="/FP">Forgot Password ?</NavLink></span>
                                    <span className="RM">Remember Me</span>
                                    <br />
                                    <input onClick={Login} className='Loginbtn' type="button" value="Login" />
                                    <input onClick={()=>{history('/Register')}} className='Signupbtn' type="button" value="Sign Up" />
                              </div>
                        </div>

                  </div>
                  <div className="second half">
                        <img className='ss' src={SS} alt="ss" width="100%" height="100%" />
                  </div>
            </div>
      )
}

export default Login