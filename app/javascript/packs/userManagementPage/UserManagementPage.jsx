import React, { useState, useEffect } from 'react'
import axios from 'axios'
import useCookies from '../general/useCookies'
import { AccountCreationForm } from './AccountCreationForm'
import { AppointmentHoldersList } from './AppointmentHoldersList'
import { UserInformation } from './UserInformation'
import { OfficerAccountsList } from './OfficerAccountsList'
import { PrimerAccountsList } from './PrimerAccountsList'
import { BoyAccountsList } from './BoyAccountsList'
import { GraduatedBoyAccountsList } from './GraduatedBoyAccountsList'

// To access current users and create new accounts
const UserManagementPage = () => {
  const cookies = useCookies()
  const [renderPage, setRenderPage] = useState(false)
  const [load, setLoad] = useState(false);
  const [pageState, setPageState] = useState("form");

  if (cookies.get('Type') == 'Boy' && cookies.get('Appointment') == null) {
    window.location.href = '/reset_password'
  }

  useEffect(() => {
    //If there is no ongoing session go back to log in page
    axios.post("/application/0/check_session", {},
    {withCredentials: true})
    .then(() => setRenderPage(true))
    .catch(() => window.location.href = '/')
  }, [])

  //Show the form to create new accounts
  function showForm () {
    setPageState("form");
  }

  function showAppointments() {
    setPageState("appointments")
  }

  function reLoad () {
    setLoad((prevLoad) => {
      return !prevLoad
    })
  }

  if (!renderPage) return null

  return(
    <div className='user-management-page'>
      <div className='page-container'>
        <div className='users-list'>
          <button onClick = {showForm}>Create New Account</button>
          <button onClick = {showAppointments}>Appointment Holders</button>
          <p>Current Users</p>
          {(cookies.get('Type') == "Officer" || cookies.get('Type') == "Admin")
           && <OfficerAccountsList setPageState = {setPageState} load={load} />}
          {cookies.get('Type') != "Boy" && <PrimerAccountsList setPageState = {setPageState} load={load} />}
          <BoyAccountsList setPageState = {setPageState} load={load} />
          <p>Graduated Boys</p>
          <GraduatedBoyAccountsList setPageState = {setPageState} load={load} />
        </div>
        <div className='main-block'>
          {pageState == "form" && <AccountCreationForm reLoad={reLoad}/>}
          {pageState == "appointments" && <AppointmentHoldersList load={load} reLoad={reLoad}/>}
          {pageState != "form" && pageState != "appointments" &&
           <UserInformation userId={pageState} showForm={showForm} reLoad={reLoad}/>}
        </div>
      </div>
    </div>
  )
}

export { UserManagementPage }