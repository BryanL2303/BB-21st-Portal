import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'

/*To allow boys to reset their password
*/
const ResetPasswordPage = () => {
  const [account, setAccount] = useState();
  
  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then()
  .catch(() => {window.location.href = '/'})

  useEffect(() => {
    setAccount()
    axios.post('/api/account/0/get_own_account', {}, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setAccount(resp.data)
    })
    .catch(error => {console.log(error)})
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
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      if (resp.data != false) {
        alert("Password has been updated successfully")
      }
      else{
        alert("Failed to update")
      }
    })
    .catch(error => {console.log(error)})      
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