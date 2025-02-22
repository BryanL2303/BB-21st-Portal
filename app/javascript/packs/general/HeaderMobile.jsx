import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import useCookies from './useCookies'

const HeaderDesktop = () => {
  const cookies = useCookies()
  const popupRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false)
  const [navigationViewable, setNavigationViewable] = useState(false)

  useEffect(() => {
    setLoggedIn(cookies.get('Name') != null)
  }, [cookies])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        toggleUserMenu(); // Close the menu
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigationViewable]);

  function toUrl(url) {
    window.location.href = url
  }

  const toggleUserMenu = () => {
    setNavigationViewable(prevState => !prevState);
  };

  function logOut () {
    cookies.remove('Name',{path:'/'});
    cookies.remove('Type',{path:'/'});
    cookies.remove('Appointment',{path:'/'});
    axios.post("/application/0/log_out", {}, {
        withCredentials: true
    })
    .then(() => window.location.href = '/')
    .catch()
  }

  return(
    <div className='header-div'>
      {<button className="menu-button" onClick={toggleUserMenu}><i className="fa-solid fa-bars fa-2xl"></i></button>}
      <div className='logo-div'><img className='logo' src="/assets/coy logo-9c8cabf89b71a4b4554e2864db559572b3b21bb9be05fafabfc844e3a584b7e1.png"></img></div>
      {!loggedIn && navigationViewable && <div className='navigation-div' ref={popupRef} tabIndex={0}>
        {/* Only uncomment the below when it has been implemented, backend function has to be created to fetch the next parade notice if its available */}
        {/* <button className="parade-notice--button" onClick={() => {toUrl('/parade_notice')}}>Parade Notice</button> */}
        <button className="log-in--button" onClick={() => {toUrl('/log_in')}}>Members Log In</button>
      </div>}

      {loggedIn && navigationViewable && <div className='navigation-div' ref={popupRef} tabIndex={0}>
        {/* Only uncomment the below when it has been implemented, backend function has to be created to fetch the next parade notice if its available */}
        {/* <button className="parade-notice--button" onClick={() => {toUrl('/parade_notice')}}>Parade Notice</button> */}
        {cookies.get("Type") == "Admin" &&
         <button className="admin--button" onClick={() => {toUrl('/admin')}}>Admin Page</button>}
        {(cookies.get("Type") != "Boy" || cookies.get("Appointment") != null) &&
         <button className="user-management--button" onClick={() => {toUrl('/user_management')}}>Users Management</button>}
        <button className="attendance-management--button" onClick={() => {toUrl('/attendance_management')}}>Parades & Attendance</button>
        {(cookies.get("Type") != "Boy" || cookies.get("Appointment") != null) &&
         <button className="award-management--button" onClick={() => {toUrl('/awards')}}>Awards</button>}
        {(cookies.get("Type") != "Boy" || cookies.get("Appointment") != null) &&
         <button className="result-generation--button" onClick={() => {toUrl('/generate_result')}}>Result Generation</button>}
        <button onClick={() => {toUrl('/reset_password')}}>Reset Log In Information</button>
        <button className="log-out--button" onClick={logOut}>Log Out</button>
      </div>}
    </div>
  )
}

export default HeaderDesktop