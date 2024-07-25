import React from 'react'
import { NavLink } from 'react-router-dom';

import '../Styles/Navbar.css'
import LOGO from '../images/SAFE SYNC big.png';
import Cross from '../images/cross.png';
import Menu from '../images/menu.webp'

function NavBar() {
      const Show = (e) => {
            // e.target.style.animation = "view 1s"
            console.log("HII")
            document.getElementById("show").classList.add("anim")
      }
      return (
            <>
                  <div className='box'>
                        <img src={LOGO} alt="logo" className="NavLogo" />
                        <div className="optionsCover">
                              <div className="laptop">
                                    <NavLink className="options" to="/Home">Home</NavLink>
                                    <NavLink className="options" to="/Home">NGOs</NavLink>
                                    <NavLink className="options" to="/AU">Profile</NavLink>
                                    <span className="vr"></span>
                                    <input className="logout" type="button" value="Logout" />
                              </div>
                              <div className="mobile">
                                    <img src={Menu} alt="menu" className="NavMenu" onClick={Show} />
                                    <div className="partition" id='show'>
                                          <img src={Cross} alt="menu" className="close" onClick={()=>{document.getElementById('show').classList.remove("anim")}} />
                                          <NavLink className="options upper" to="/Home">Home</NavLink>
                                          <br />
                                          <NavLink className="options" to="/Home">NGOs</NavLink>
                                          <br />
                                          <NavLink className="options" to="/AU">Profile</NavLink>
                                          <br />
                                          <br />

                                          <input className="logout" type="button" value="Logout" />
                                    </div>
                              </div>
                        </div>
                  </div>

            </>

      )
}

export default NavBar