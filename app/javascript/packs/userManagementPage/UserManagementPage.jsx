import React, { useState, useContext } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'
import {AccountCreationForm} from './AccountCreationForm'
import {UserInformation} from './UserInformation'
import {OfficerAccountsList} from './OfficerAccountsList'
import {PrimerAccountsList} from './PrimerAccountsList'
import {BoyAccountsList} from './BoyAccountsList'

/*To access current users and create new accounts
*/
const UserManagementPage = () => {
  const cookies = new Cookies()
  const [pageState, setPageState] = useState("form");

  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
  }

  //Show the form to create new accounts
  function showForm () {
    setPageState("form");
  }

  return(
    <div className='user-management-page'>
      <NavigationBar/>
      <div className='page-container'>
        <div className='users-list'>
          <button onClick = {showForm}>Create New Account</button>
          <p>Current Users</p>
          {(cookies.get('Type') == "Officer" || cookies.get('Type') == "Admin") && <OfficerAccountsList setPageState = {setPageState}/>}
          {cookies.get('Type') != "Boy" && <PrimerAccountsList setPageState = {setPageState}/>}
          {cookies.get('Type') != "Boy" && <BoyAccountsList setPageState = {setPageState}/>}
        </div>
        <div className='main-block'>
          {pageState == "form" && <AccountCreationForm/>}
          {pageState != "form" && <UserInformation userId={pageState} showForm={showForm}/>}
        </div>
      </div>
    </div>
  )
}

export { UserManagementPage }