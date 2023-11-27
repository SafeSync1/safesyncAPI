import React, { useEffect, useState } from 'react'
import { otp, setOtp, developement } from "../processes/userData"
import { useNavigate } from 'react-router-dom'

import FP from "../images/FP.jpg"
import LOGO from '../images/SAFE SYNC big.png'
import SN from '../images/SAFE SYNC NGO.png'
import SB from '../images/SAFE SYNC BRANCH.png'

function ForgotPassword() {
      const [NorB, setnorb] = useState(0);
      const [ngo, setngo] = useState("");
      const [ngos, setngos] = useState([]);
      const [inputValues, setInputValues] = useState({
            email: "", password: ""
      });
      const history = useNavigate();
      useEffect(() => {
            fetchData()
            document.getElementById(`${NorB}`).style.opacity = 1;
            document.getElementById(`${NorB === 0 ? 1 : 0}`).style.opacity = 0.5
      }, [NorB, ngo])
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
      const SendMail = async (e) => {
            const res = await fetch((developement ? 'http://localhost:5000/SendOtp' : '/SendOtp'), {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                  },
                  body: JSON.stringify({
                        nEmail: (NorB === 0) ? inputValues.email : ngo,
                        userType: (NorB === 0) ? "ngo" : "branch",
                        bEmail: (NorB === 0) ? "" : inputValues.email
                  })
            })

            const data = await res.json();

            if (data.status === 406) {
                  alert("Fill the fields properly")
            }
            else if (data.status === 407) {
                  alert("Ngo/Branch with this email does not Exist")
            }
            else if (data.status === 500) {
                  alert("Internal server error")
            }
            else if (data.status === 200) {
                  setOtp({
                        state: true,
                        FP: true,
                        nEmail: (NorB === 0) ? inputValues.email : ngo,
                        userType: (NorB === 0) ? "ngo" : "branch",
                        bEmail: (NorB === 0) ? "" : inputValues.email
                  })
                  alert("Otp sent!!")
                  history("/Otp")
            }
      }
      const Handle = (event) => {
            const { name, value } = event.target;
            setInputValues({ ...inputValues, [name]: value });
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
            <>
                  <div className="main">
                        <div className="first part1">
                              <div className="innerpart">
                                    <div className="starter">
                                          <img src={LOGO} alt="logo" className="LOGO" />
                                          <div className="title">Forgot <br />Password </div>
                                    </div>
                                    <img id="0" onClick={change} className='sn1' src={SN} alt="sn" width="100px" height="100px" />
                                    <img id="1" onClick={change} src={SB} alt="SB" className="sn1" width="100px" height="100px" />
                                    <div className="form">
                                          <Decide />
                                          <div className="input-container">
                                                <input type="email" name="email" onChange={Handle} placeholder='' />
                                                <label>{(NorB === 0) ? "NGO " : "Branch "}  Email</label>
                                          </div>
                                          <input type="button" onClick={SendMail} value="Send Otp" className="Loginbtn" />

                                    </div>

                              </div>
                        </div>
                        <div className="second part2">
                              <img className='ss' src={FP} alt="ss" width="100%" height="100%" />
                        </div>
                  </div>
            </>
      )

}

export default ForgotPassword