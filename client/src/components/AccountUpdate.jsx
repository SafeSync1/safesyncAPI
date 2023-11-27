import React from 'react'

import LOGO from '../images/SAFE SYNC big.png';
import AU from "../images/AU.jpg"

function AccountUpdate() {
      return (
            <>
                  <div className="main">
                        <div className="first part1">
                              <div className="innerpart">
                                    <div className="starter">
                                          <img src={LOGO} alt="logo" className="LOGO" />
                                          <div className="title">Account<br />Update </div>
                                    </div>
                              </div>
                        </div>
                        <div className="second part2">
                              <img className='ss' src={AU} alt="ss" width="100%" height="100%" />
                        </div>
                  </div>
            </>
      )
}

export default AccountUpdate