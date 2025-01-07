import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NavigationBar } from '../general/NavigationBar'
import { handleServerError } from '../general/handleServerError'

/*To allow boys to reset their password
*/
const ResetPasswordPage = () => {
  const [account, setAccount] = useState();

  useEffect(() => {
    //If there is no ongoing session go back to log in page
    axios.post("/application/0/check_session", {}, {
      withCredentials: true
    })
    .then(() =>
      axios.post('/api/account/0/get_own_account', {}, {
        withCredentials: true
      })
      .then(resp => {
        setAccount(resp.data)
      })
      .catch(resp => {handleServerError(resp.response.status)})
    )
    .catch(() => {window.location.href = '/'})
  }, [])

  function editAccount(e) {
    e.preventDefault()
    axios.post('/api/account/' + account.id + '/edit_account', {
      id: account.id,
      account_name: account.account_name,
      user_name: e.target.elements['user_name'].value,
      abbreviated_name: account.abbreviated_name,
      password: e.target.elements['password'].value,
      account_type: account.account_type,
      rank: account.rank,
      level: account.level,
      credentials: account.credentials,
      honorifics: account.honorifics
    }, {
      withCredentials: true
    })
    .then(resp => {
      if (resp.data != false) {
        alert("Log in information has been updated successfully")
      }
      else{
        alert("Failed to update")
      }
    })
    .catch(resp => {handleServerError(resp.response.status)})
  }

  return(
    <div className='reset-password-page'>
      <NavigationBar/>
      <div className='user-information'>
        <h1>Reset Username and Password</h1>
        {account != null && <form className="edit-account-form" onSubmit={editAccount}>
          <label>Username: </label>
          <input className='edit-field' name={'user_name'} defaultValue={account.user_name}></input>
          <br/>
          <label>Password: </label>
          <input className='edit-field' name={'password'} defaultValue={account.password}></input>
          <br/>
          <button className="edit-button">Save Changes</button>
        </form>}
      </div>
    </div>
  )
}

export { ResetPasswordPage }