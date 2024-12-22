import React, { useState } from 'react'
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types'
import axios from 'axios'
import useCookies from '../general/useCookies'
import { handleServerError } from '../general/handleServerError'

// To create new accounts
const AccountCreationForm = ({ reLoad }) => {
  const cookies = useCookies()
  const [accountType, setAccountType] = useState('Boy');
  const [accountRank, setAccountRank] = useState('REC');
  const [accountLevel, setAccountLevel] = useState('1');
  const [accountClass, setAccountClass] = useState();
  const [accountHonorific, setAccountHonorific] = useState();
  const [accountRollCall, setAccountRollCall] = useState(true);

  function setType(e) {
    e.preventDefault()
    setAccountType(e.target.className)
    document.getElementsByClassName('create-account-form__type')[0].innerHTML = e.target.className
    if (e.target.className == "Primer") setAccountRank('CLT')
    else if (e.target.className == 'Officer') setAccountRank(null)
  }

  function setRank(e) {
    e.preventDefault()
    document.getElementsByClassName('create-account-form__rank')[0].innerHTML = e.target.className? e.target.className: '-'
    setAccountRank(e.target.className? e.target.className: null)
  }

  function setLevel(e) {
    e.preventDefault()
    document.getElementsByClassName('create-account-form__level')[0].innerHTML = e.target.className
    setAccountLevel(e.target.className)
  }

  function setOfficerClass(e) {
    e.preventDefault()
    document.getElementsByClassName('create-account-form__class')[0].innerHTML = e.target.className
    setAccountClass(e.target.className)
  }

  function setHonorific(e) {
    e.preventDefault()
    document.getElementsByClassName('create-account-form__honorific')[0].innerHTML = e.target.className
    setAccountHonorific(e.target.className)
  }

  function setRollCall(e) {
    e.preventDefault()
    document.getElementsByClassName('create-account-form__roll-call')[0].innerHTML = e.target.className
    setAccountRollCall(e.target.className == 'Yes')
  }

  //Sends the information from the form to the backend to try and create an account
  //If the username is not unique returns an alert back to the user
  function submitForm(e) {
    e.preventDefault()
    let credential = null
    let level = null
    let submit = true
    if (accountType == "Boy") level = accountLevel
    else {
      credential = e.target.elements['credentials'].value
      if (credential == '') submit = false
    }
    if (e.target.elements['user_name'].value == '' || e.target.elements['password'].value == '') submit = false
    if (submit) {
      axios.post('/api/account/0/create_account', {
        account_name: e.target.elements['account_name'].value,
        user_name: e.target.elements['user_name'].value,
        abbreviated_name: e.target.elements['abbreviated_name'].value,
        password: e.target.elements['password'].value,
        account_type: accountType,
        rank: accountRank,
        level: level,
        class1: accountType === "Officer" ? accountClass: null,
        credentials: credential,
        honorifics: accountHonorific,
        roll_call: accountRollCall
      }, {
        withCredentials: true
      })
      .then(resp => {
        if (resp.data != false) {
          alert("Account has been created. If the user does not show up on the list to the left please refresh the page!")
          e.target.elements['account_name'].value = ''
          e.target.elements['user_name'].value = ''
          e.target.elements['abbreviated_name'].value = ''
          e.target.elements['password'].value = ''
          reLoad()
        }
        else alert("Username has been taken, please try another name.")
      })
      .catch(resp => handleServerError(resp.response.status))
    }
    else alert("Please fill in all fields first")
  }

  return(
    <form className='create-account-form' onSubmit={ submitForm }>
      <label style={{fontSize: '30px'}}>Account Creation</label>
      <br/>
      <label>Full Name: </label>
      <input className='create-account-form__name' name={'account_name'} placeholder='full name'></input>
      <br/>
      <label>User Name: </label>
      <input className='edit-field' name={"user_name"} placeholder='user name'></input>
      <br/>
      <label>Abbreviated Name: </label>
      <input className='edit-field' name={"abbreviated_name"} placeholder='abbreviated name'></input>
      <br/>
      <label>Password: </label>
      <input className='create-account-form__password' name={'password'} placeholder='password'></input>
      <br/>
      <label>Account Type: </label>
      <Popup className='account-type-popup' trigger={<label className='create-account-form__type'>Boy</label>} position="bottom">
        {(cookies.get('Type') == "Officer" || cookies.get('Type') == "Admin") &&
         <p className='Officer' onClick={setType}>Officer</p>}
        {(cookies.get('Type') == "Primer" || cookies.get('Type') == "Officer" || cookies.get('Type') == "Admin") &&
         <p className='Primer' onClick={setType}>Primer</p>}
        <p className='Boy' onClick={setType}>Boy</p>
      </Popup>
      <br/>
      {accountType != null && <label>Rank: </label>}
      {accountType == "Officer" &&
       <Popup className='account-rank-popup' trigger={<label className='create-account-form__rank'>-</label>} position="bottom">
        <p className={null} onClick={setRank}>-</p>
        <p className='LTA' onClick={setRank}>LTA</p>
        <p className='2LT' onClick={setRank}>2LT</p>
        <p className='OCT' onClick={setRank}>OCT</p>
      </Popup>}
      {accountType == "Primer" &&
       <Popup className='account-rank-popup' trigger={<label className='create-account-form__rank'>CLT</label>} position="bottom">
        <p className='SCL' onClick={setRank}>SCL</p>
        <p className='CLT' onClick={setRank}>CLT</p>
      </Popup>}
      {accountType == "Boy" &&
       <Popup className='account-rank-popup' trigger={<label className='create-account-form__rank'>REC</label>} position="bottom">
        <p className='WO' onClick={setRank}>WO</p>
        <p className='SSG' onClick={setRank}>SSG</p>
        <p className='SGT' onClick={setRank}>SGT</p>
        <p className='CPL' onClick={setRank}>CPL</p>
        <p className='LCP' onClick={setRank}>LCP</p>
        <p className='PTE' onClick={setRank}>PTE</p>
        <p className='REC' onClick={setRank}>REC</p>
      </Popup>}
      {(accountClass == "STAFF" || accountRank == null) && <br/>}
      {(accountClass == "STAFF" || accountRank == null) && <label>Honorifics: </label>}
      {(accountClass == "STAFF" || accountRank == null) && <Popup className='account-honorific-popup' trigger={<label className='create-account-form__honorific'>Mr</label>} position="bottom">
        <p className='Mr' onClick={setHonorific}>Mr</p>
        <p className='Ms' onClick={setHonorific}>Ms</p>
        <p className='Mrs' onClick={setHonorific}>Mrs</p>
      </Popup>}
      <br/>
      {(cookies.get("Type") == 'Admin' || cookies.get("Type") == 'Officer' || cookies.get("Appointment") == 'CSM') &&
        <label>Should this user appear in the attendance nominal roll? : </label>}
      {(cookies.get("Type") == 'Admin' || cookies.get("Type") == 'Officer' || cookies.get("Appointment") == 'CSM') &&
        <Popup className='account-roll-call-popup' trigger={<label className='create-account-form__roll-call'>Yes</label>} position="bottom">
        <p className='Yes' onClick={setRollCall}>Yes</p>
        <p className='No' onClick={setRollCall}>No</p>
      </Popup>}
      
      <br/>
      {accountType == "Boy" && <label>Level: Secondary </label>}
      {accountType == "Boy" &&
       <Popup className='account-level-popup' trigger={<label className='create-account-form__level'>1</label>} position="bottom">
        <p className='5' onClick={setLevel}>5</p>
        <p className='4' onClick={setLevel}>4</p>
        <p className='3' onClick={setLevel}>3</p>
        <p className='2' onClick={setLevel}>2</p>
        <p className='1' onClick={setLevel}>1</p>
      </Popup>}

      {accountType == "Officer" && <br/>}
      {accountType == "Officer" && <label>Class:</label>}
      {accountType == "Officer" && <Popup className='account-class-popup' trigger={<label className='create-account-form__class'>-</label>} position="bottom">
        <p className='VAL' onClick={setOfficerClass}>VAL</p>
        <p className='STAFF' onClick={setOfficerClass}>STAFF</p>
        <p className='UNI' onClick={setOfficerClass}>UNI</p>
        <p className='POLY' onClick={setOfficerClass}>POLY</p>
      </Popup>}

      {(accountType == "Primer" || accountType == "Officer") &&
       <label>Credentials (For 32A results): </label>}
      {(accountType == "Primer" || accountType == "Officer") &&
       <input className='account-credentials' name={'credentials'} placeholder='credentials'></input>}
      <button>Create Account</button>
    </form>
  )
}

AccountCreationForm.propTypes = {
  reLoad: PropTypes.func.isRequired
}

export { AccountCreationForm }