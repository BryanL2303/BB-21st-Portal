import React, { useState, useContext } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { errorMessage } from '../general/functions';

/*To log in, accounts can only be created by existing users
*/
const LogInPage = () => {
  const cookies = new Cookies()

  //If there is an ongoing session go to home page
  if (cookies.get('Token') != null) {
    window.location.href = '/home'
  }

  //Handle submit form event to authenticate account with backend
  function submitForm(e) {
    e.preventDefault()
    axios.post('/api/account/0/authenticate_account', {
      account_name: e.target[0].value,
      password: e.target[1].value,
    })
    .then(resp => {
      console.log(resp)
      if (resp.data != false) {
        //If account is authenticated save JWT in cookies
        cookies.set('Name', resp.data.account_name, { path: '/' });
        cookies.set('Token', resp.data.token, { path: '/' });
        cookies.set('Type', resp.data.account_type, { path: '/' });
        window.location.href = '/home'
      }
      else {
        alert("Username or password is wrong, please double check input.")
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <div className='log-in-page'>
      <form className='log-in-form' onSubmit={ submitForm }>
        <label>Quiz Portal</label>
        <input className='log-in-form__name' placeholder='username'></input>
        <input className='log-in-form__password' type='password' placeholder='password'></input>
        <button>Log In</button>
      </form>
    </div>
  )
}

export { LogInPage }