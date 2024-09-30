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
      account_name: e.target.elements["username"].value,
      password: e.target.elements["password"].value,
    }, {
      withCredentials: true
    })
    .then(resp => {
      if (resp.data != false) {
        //If account is authenticated save account information in cookies
        cookies.set('Name', resp.data.account_name, { path: '/' });
        cookies.set('Type', resp.data.account_type, { path: '/' });
        window.location.href = '/home'
      }
      else {
        alert("Username or password is wrong, please double check input.")
      }
    })
    .catch(resp => handleServerError(resp.response.status))
  }

  return(
    <div className='log-in-page'>
      <div className='navigation-bar'>
        <img className="crest" src="/packs/media/packs/general/bb-crest-7106b85f04ce6829d39a973203d05a81.png" alt="BB Crest"></img>
      </div>
      
      <form className='log-in-form' onSubmit={ submitForm }>
        <label>BB 21st Portal</label>
        <input className='log-in-form__name' name={"username"} placeholder='username'></input>
        <input className='log-in-form__password' type='password' name={"password"} placeholder='password'></input>
        <br/>
        <br/>
        <button>Log In</button>
      </form>
    </div>
  )
}

export { LogInPage }