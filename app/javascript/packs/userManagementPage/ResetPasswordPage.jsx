import React, { useEffect, useState, useContext } from 'react'
import Popup from 'reactjs-popup';
import Cookies from 'universal-cookie'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'

/*To allow boys to reset their password
*/
const ResetPasswordPage = () => {
  const cookies = new Cookies()
  const [account, setAccount] = useState();
  
  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
  }

  useEffect(() => {
    setAccount()
    axios.post('/api/account/0/get_own_account', {
      'token': cookies.get('Token')
    })
    .then(resp => {
      setAccount(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  function editAccount(e) {
    e.preventDefault()
    axios.post('/api/account/' + account.id + '/edit_account', {
      id: account.id,
      account_name: account.account_name,
      password: e.target[0].value,
      account_type: account.account_type,
      rank: account.rank,
      level: account.level,
      credentials: account.credentials
    })
    .then(resp => {
      if (resp.data != false) {
        alert("Password has been updated successfully")
      }
      else{
        alert("Failed to update")
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))      
  }

  return(
    <div className='reset-password-page'>
      <NavigationBar/>
      <div className='user-information'>
        <h1>Reset Password</h1>
        {account != null && <form className="edit-account-form" onSubmit={editAccount}>
          <label>Password: </label>
          <input className='edit-field' defaultValue={account.password}></input>
          <br/>
          <button className="edit-button">Save Changes</button>
        </form>}
      </div>
    </div>
  )
}

export { ResetPasswordPage }