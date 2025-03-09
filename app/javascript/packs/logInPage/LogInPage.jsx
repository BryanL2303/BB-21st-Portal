import React from 'react'
import axios from 'axios'
import useCookies from '../general/useCookies'
import { handleServerError } from '../general/handleServerError';

// To log in, accounts can only be created by existing users
const LogInPage = () => {
  // Cookies are only used for name and account type, JWT is handled by backend
  const cookies = useCookies()

  // If there is an ongoing session go to home page
  // No useEffect as we do not need to render the component if we are redirecting
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then(() => window.location.href = '/home')
  .catch(resp => {
    if (resp.response.status != 401) handleServerError(resp.response.status)
  })

  //Handle submit form event to authenticate account with backend
  function submitForm(e) {
    e.preventDefault()
    axios.post('/api/account/0/authenticate_account', {
      user_name: e.target.elements["username"].value,
      password: e.target.elements["password"].value,
    }, {
      withCredentials: true
    })
    .then(resp => {
      if (resp.data != false) {
        //If account is authenticated save account information in cookies
        cookies.set('Name', resp.data.account_name, { path: '/' });
        cookies.set('Type', resp.data.account_type, { path: '/' });
        if (resp.data.appointment != null) {
          cookies.set('Appointment', resp.data.appointment, { path: '/' })
        }
        window.location.href = '/home'
      }
    })
    .catch(resp => {
      if (!resp.data) alert("Incorrect Username or Password. Please try again.")
      else handleServerError(resp.response.status)
    })
  }

  return(
    <div className='log-in-page'>      
      <form className='log-in-form' onSubmit={ submitForm }>
        <h2>BB 21<sup>st</sup> Portal</h2>

        <label htmlFor="username">
          <i className='fa-solid fa-user'></i>  
          Username:
        </label>
        <input className='log-in-form__name' name={"username"} id='username' placeholder='Enter Username' required></input>
        
        <label htmlFor="password">
          <i className='fa-solid fa-lock'></i>
          Password:
        </label>
        <input className='log-in-form__password' type='password' id='password' name={"password"} placeholder='Enter Password'></input>
        <br/>
        <button>Log In</button>
      </form>
    </div>
  )
}

export { LogInPage }