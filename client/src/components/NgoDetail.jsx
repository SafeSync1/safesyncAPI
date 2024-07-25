import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { developement } from "../processes/userData";
import Cookies from "universal-cookie";
// import { set } from 'mongoose';

function NgoDetail() {
    const { nEmail } = useParams();
    const [ngo, setNgo] = useState();
    const cookie = new Cookies();
    useEffect(() => {
        //   fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const res = await fetch(
                developement
                    ? "http://localhost:5000/isLoggedIn"
                    : "/isLoggedIn",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        need: 5,
                        token: cookie.get("Token"),
                        userType: "ngo",
                        nEmail: nEmail,
                    }),
                }
            );
            console.log(ngo);
            const data = await res.json();
            if (data.status === 406) {
                console.log("Fields Missing");
            } else if (data.status === 500) {
                alert("Internal server error");
            } else if (data.status === 200) {
                setNgo(data.data);
            }
            console.log(data.data);
        } catch (error) {
            console.log(error);
        }
    };
    fetchData();
    return (
        <>
            <div className="pare">
                <div className="main">
                    <div className="first part1"></div>
                </div>
            </div>
        </>
    );
}

export default NgoDetail;
