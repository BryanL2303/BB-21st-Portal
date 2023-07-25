import React, { useState, useContext } from 'react'
import Popup from 'reactjs-popup';
import Cookies from 'universal-cookie'
import axios from 'axios'

/*To create new accounts
*/
const AccountCreationForm = () => {
  const cookies = new Cookies()
  const [accountType, setAccountType] = useState('Boy');

  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
  }

  function setType(e) {
    e.preventDefault()
    setAccountType(e.target.className)
    document.getElementsByClassName('create-account-form__type')[0].innerHTML = e.target.className
  }

  function setRank(e) {
    e.preventDefault()
    document.getElementsByClassName('create-account-form__rank')[0].innerHTML = e.target.className
  }

  function setLevel(e) {
    e.preventDefault()
    document.getElementsByClassName('create-account-form__level')[0].innerHTML = e.target.className
  }

  function doNothing(e) {
    e.preventDefault()
  }

  //Sends the information from the form to the backend to try and create an account
  //If the username is not unique returns an alert back to the user
  function submitForm(e) {
    e.preventDefault()
    let credentials = null
    let level = null
    let submit = true
    if (accountType == "Boy") {
      level = e.target[4].value
      if (isNaN(parseInt(level))) {
        submit = false
      }
    } else {
      credential = e.target[4].value
      if (credential == '') {
        submit = false
      }
    }
    if (e.target[0].value == '' || e.target[1].value == '' || e.target[2].value == '' || e.target[3].value == '') {
      submit = false
    }
    if (submit) {
      axios.post('/api/account/0/create_account', {
        account_name: e.target[0].value,
        password: e.target[1].value,
        account_type: e.target[2].value,
        rank: e.target[3].value,
        level: level,
        credentials: credentials
      })
      .then(resp => {
        if (resp.data != false) {
          alert("Account has been created, please refresh the page to update user list")
          e.target[0].value = ''
          e.target[1].value = ''
          e.target[2].value = ''
          setAccountType()
        }
        else{
          alert("Username has been taken, please try another name.")
        }
      })
      .catch(resp => errorMessage(resp.response.statusText))      
    }
    else {
      alert("Please fill in all fields first")
    }
  }

  return(
    <form className='create-account-form' onSubmit={ submitForm }>
      <label style={{fontSize: '30px'}}>Account Creation</label>
      <br/>
      <label>User Name: </label>
      <input className='create-account-form__name' placeholder='username'></input>
      <br/>
      <label>Password: </label>
      <input className='create-account-form__password' placeholder='password'></input>
      <br/>
      <label>Account Type: </label>
      <Popup className='account-type-popup' trigger={<label className='create-account-form__type'>Boy</label>} position="bottom">
        {cookies.get('Type') == "Officer" && <p className='Officer' onClick={setType}>Officer</p>}
        <p className='Primer' onClick={setType}>Primer</p>
        <p className='Boy' onClick={setType}>Boy</p>
      </Popup>
      <br/>
      {accountType != null && <label>Rank: </label>}
      {accountType == "Officer" && <Popup className='account-rank-popup' trigger={<label className='create-account-form__rank'>2LT</label>} position="bottom">
        <p className='LTA' onClick={setRank}>LTA</p>
        <p className='2LT' onClick={setRank}>2LT</p>
        <p className='OCT' onClick={setRank}>OCT</p>
        <p className='VAL' onClick={setRank}>VAL</p>
      </Popup>}
      {accountType == "Primer" && <Popup className='account-rank-popup' trigger={<label className='create-account-form__rank'>CLT</label>} position="bottom">
        <p className='SCL' onClick={setRank}>SCL</p>
        <p className='CLT' onClick={setRank}>CLT</p>
      </Popup>}
      {accountType == "Boy" && <Popup className='account-rank-popup' trigger={<label className='create-account-form__rank'>REC</label>} position="bottom">
        <p className='WO' onClick={setRank}>WO</p>
        <p className='SSG' onClick={setRank}>SSG</p>
        <p className='SGT' onClick={setRank}>SGT</p>
        <p className='CPL' onClick={setRank}>CPL</p>
        <p className='LCP' onClick={setRank}>LCP</p>
        <p className='PTE' onClick={setRank}>PTE</p>
        <p className='REC' onClick={setRank}>REC</p>
      </Popup>}
      <br/>
      {accountType == "Boy" && <label>Level: Secondary </label>}
      {accountType == "Boy" && <Popup className='account-level-popup' trigger={<label className='create-account-form__level'>1</label>} position="bottom">
        <p className='5' onClick={setLevel}>5</p>
        <p className='4' onClick={setLevel}>4</p>
        <p className='3' onClick={setLevel}>3</p>
        <p className='2' onClick={setLevel}>2</p>
        <p className='1' onClick={setLevel}>1</p>
      </Popup>}
      {(accountType == "Primer" || accountType == "Officer") && <label>Credentials (For 32A results): </label>}
      {(accountType == "Primer" || accountType == "Officer") && <input className='account-credentials'></input>}
      <button>Create Account</button>
    </form>
  )
}

export { AccountCreationForm }