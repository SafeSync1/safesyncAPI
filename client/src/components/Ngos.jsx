import React, { useState, useEffect } from 'react'
import { developement } from '../processes/userData';

import '../Styles/pages.css'
import NavBar from './NavBar'

function Ngos() {
      const [ngos, setngos] = useState([]);
      useEffect(() => {
            fetchData()
      }, [])
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
      const set = (e) => {

      }
      const mapit = (e) => {
            return (
                  <div className='ngo' key={e.nEmail} id={e.nEmail} onClick={set}>
                        {e.nName}
                  </div>
            )


      }
      return (
            <>
                  <NavBar />
                  <div className="cover">
                        {ngos.map(mapit)}
                  </div>
            </>
      )
}

export default Ngos