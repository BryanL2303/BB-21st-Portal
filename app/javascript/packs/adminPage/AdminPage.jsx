import React, { useState, useContext } from 'react'
import Cookies from 'universal-cookie';
import axios from 'axios'
import { errorMessage } from '../general/functions';

/*Only meant for admin to initialise the page
*/
const AdminPage = () => {
  const cookies = new Cookies()

  //If there is an ongoing session go to home page
  if (cookies.get('Token') != null) {
    window.location.href = '/home'
  }

  //Sends the information from the form to the backend to try and create an account
  //If the username is not unique returns an alert back to the user
  function submitForm(e) {
    e.preventDefault()
    axios.post('/api/account/0/create_account', {
      account_name: e.target[0].value,
      password: e.target[1].value,
      account_type: e.target[2].value
    })
    .then(resp => {
      if (resp.data != false) {
        cookies.set('Name', resp.data.name, { path: '/' });
        cookies.set('Token', resp.data.token, { path: '/' });
        window.location.href = '/home'        
      }
      else{
        alert("Username has been taken, please try another name.")
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <div className='create-account-page'>
      <form className='create-account-form' onSubmit={ submitForm }>
        <label>Account Creation</label>
        <input className='create-account-form__name' placeholder='username'></input>
        <input className='create-account-form__password' placeholder='password'></input>
        <input className='create-account-form__type' placeholder='Officer/Primer/Boy'></input>
        <button>Create Account</button>
      </form>
    </div>
  )
}

export { AdminPage }