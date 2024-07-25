import React, { useState, useEffect } from "react";
import { developement, setOtp } from "../processes/userData";
import { useNavigate } from "react-router-dom";

import "../Styles/Register.css";
import OP from "../images/rocket.jpg";
import LOGO from "../images/SAFE SYNC big.png";
import SN from "../images/SAFE SYNC NGO.png";
import SB from "../images/SAFE SYNC BRANCH.png";

function Register() {
    const [NorB, setnorb] = useState(0);
    const [ngo, setngo] = useState("");
    const [ngos, setngos] = useState([]);
    const [inputValues, setInputValues] = useState({
        name: "",
        email: "",
        password: "",
    });
    const history = useNavigate();
    useEffect(() => {
        fetchData();
        document.getElementById(`${NorB}`).style.opacity = 1;
        document.getElementById(`${NorB === 0 ? 1 : 0}`).style.opacity = 0.5;
    }, [NorB, ngo]);
    let form = new FormData();
    const Register = async () => {
        try {
            if (NorB === 0) {
                if (
                    !inputValues.name ||
                    !inputValues.email ||
                    !inputValues.password
                ) {
                    alert("fill the fields properly");
                } else if (!form.get("document")) {
                    alert("Please select file");
                } else if (!inputValues.email.includes("@")) {
                    alert("Insert a valid email");
                } else {
                    try {
                        form.append("name", inputValues.name);
                        form.append("email", inputValues.email);
                        form.append("password", inputValues.password);
                        const res = await fetch(
                            developement
                                ? "http://localhost:5000/ngoRegister"
                                : "/ngoRegister",
                            {
                                method: "POST",
                                headers: {
                                    // "Content-Type": "application/json",
                                    // Accept: "application/json",
                                    "Access-Control-Allow-Origin": "*",
                                },
                                body: form,
                            }
                        );

                        const data = await res.json();

                        if (data.status === 406) {
                            alert("Fill the fields properly1");
                        } else if (data.status === 422) {
                            alert("Email already Exist");
                        } else if (data.status === 500) {
                            alert("Internal server error");
                        } else if (data.status === 201) {
                            setOtp({
                                state: true,
                                userType: "ngo",
                                nEmail: inputValues.email,
                            });
                            alert("Registration Successful");
                            history("/Otp");
                        } else {
                            throw Error;
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        alert("Unknown error");
                    }
                }
            } else if (NorB === 1) {
                if (ngo === "") {
                    alert("Please Select a NGO");
                } else if (!form.get("document")) {
                    alert("Please select file");
                } else if (
                    !inputValues.name ||
                    !inputValues.email ||
                    !inputValues.password
                ) {
                    alert("fill the fields properly");
                } else if (!inputValues.email.includes("@")) {
                    alert("Insert a valid email");
                } else {
                    try {
                        form.append("name", inputValues.name);
                        form.append("bEmail", inputValues.email);
                        form.append("password", inputValues.password);
                        form.append("nEmail", ngo);
                        const res = await fetch(
                            developement
                                ? "http://localhost:5000/bRegister"
                                : "/bRegister",
                            {
                                method: "POST",
                                headers: {
                                    // "Content-Type": "application/json",
                                    // Accept: "application/json",
                                    "Access-Control-Allow-Origin": "*",
                                },
                                body: form,
                            }
                        );

                        const data = await res.json();

                        if (data.status === 406) {
                            alert("Fill the fields properly");
                        } else if (data.status === 422) {
                            alert("Branch with this email Already Exist");
                        } else if (data.status === 500) {
                            alert("Internal server error");
                        } else if (data.status === 201) {
                            setOtp({
                                state: true,
                                userType: "branch",
                                bEmail: inputValues.email,
                                nEmail: ngo,
                            });
                            alert("Registration Successful");
                            history("/Otp");
                        } else {
                            throw Error;
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        alert("Unknown error");
                    }
                }
            }
        } catch (e) {
            console.log(e);
            alert("Unknown error");
        }
    };
    const Handle = (event) => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };
    const change = (e) => {
        if (Number(e.target.id) === 0) {
            if (NorB !== 0) {
                setnorb(0);
            }
        } else {
            if (NorB !== 1) {
                setnorb(1);
            }
        }
    };
    const fetchData = async () => {
        try {
            const res = await fetch(
                developement
                    ? "http://localhost:5000/GetNgoList"
                    : "/GetNgoList",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );

            const data = await res.json();
            if (data.state === 500) {
                alert("Internal server error");
            } else {
                setngos(data.data);
            }
        } catch (error) {
            console.error("Error:", error);
            // alert("Unknown error occured")
        }
    };

    const Decide = () => {
        if (NorB === 1) {
            return (
                <>
                    <div
                        className="selector"
                        onMouseOut={() => {
                            document.getElementsByClassName(
                                "dropdown-content"
                            )[0].style.display = "none";
                        }}
                        onMouseOver={() => {
                            document.getElementsByClassName(
                                "dropdown-content"
                            )[0].style.display = "block";
                        }}
                    >
                        <input
                            className="DD"
                            type="button"
                            value={ngo === "" ? "Select Ngo" : "Ngo selected"}
                        />

                        <div className="dropdown-content">
                            {ngos.map(mapit)}
                        </div>
                    </div>
                </>
            );
        } else {
            return <></>;
        }
    };
    const set = (e) => {
        setngo(e.target.id);
        document.getElementsByClassName("dropdown-content")[0].style.display =
            "none";
    };
    const mapit = (e) => {
        if (e.nEmail === ngo) {
            return (
                <div key={e.nEmail} className="selected">
                    {e.nName}
                </div>
            );
        } else {
            return (
                <div key={e.nEmail} id={e.nEmail} onClick={set}>
                    {e.nName}
                </div>
            );
        }
    };
    return (
        <div className="parent">
            <div className="main">
                <div className="first part1">
                    <div className="innerpart">
                        <div className="starter">
                            <img src={LOGO} alt="logo" className="LOGO" />
                            <div className="title">
                                Registration <br />
                                form{" "}
                            </div>
                        </div>
                        <img
                            id="0"
                            onClick={change}
                            className="sn1"
                            src={SN}
                            alt="sn"
                            width="100px"
                            height="100px"
                        />
                        <img
                            id="1"
                            onClick={change}
                            src={SB}
                            alt="SB"
                            className="sn1"
                            width="100px"
                            height="100px"
                        />
                        <div className="form">
                            <Decide />
                            <div className="input-container">
                                <input
                                    type="name"
                                    onChange={Handle}
                                    name="name"
                                    placeholder=""
                                />
                                <label>
                                    {NorB === 0 ? "NGO " : "Branch "} Name
                                </label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="email"
                                    name="email"
                                    onChange={Handle}
                                    placeholder=""
                                />
                                <label>
                                    {NorB === 0 ? "NGO " : "Branch "} Email
                                </label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="password"
                                    name="password"
                                    onChange={Handle}
                                    placeholder=""
                                />
                                <label>Password</label>
                            </div>
                            Document for verification purpose:{" "}
                            <input
                                type="file"
                                onChange={(e) => {
                                    form.append("document", e.target.files[0]);
                                }}
                                accept="application/pdf"
                                name="document"
                                id="document"
                            />
                            <br />
                            <input
                                type="button"
                                onClick={Register}
                                value="Sign up"
                                className="Loginbtn"
                            />
                            <input
                                type="button"
                                onClick={() => {
                                    history("/login");
                                }}
                                value="Login"
                                className="Signupbtn"
                            />
                        </div>
                    </div>
                </div>
                <div className="second part2">
                    <img
                        className="ss"
                        src={OP}
                        alt="ss"
                        width="100%"
                        height="100%"
                    />
                </div>
            </div>
        </div>
    );
}

export default Register;
