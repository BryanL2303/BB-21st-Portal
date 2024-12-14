import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'
import useCookies from '../general/useCookies';

// To view users information and delete user accounts
const UserInformation = ({userId, showForm, reLoad}) => {
  const cookies = useCookies()
  const [account, setAccount] = useState();
  const [accountRank, setAccountRank] = useState();
  const [accountLevel, setAccountLevel] = useState();
  const [accountHonorific, setAccountHonorific] = useState();
  const [accountRollCall, setAccountRollCall] = useState(true);
  const [accountPastRank, setAccountPastRank] = useState({1: null, 2: null, 3: null, 4: null, 5: null})

  useEffect(() => {
    setAccount(() => {
      return null
    })
    axios.post('/api/account/' + userId + '/get_account_information', {
      'id': userId
    }, {
      withCredentials: true
    })
    .then(resp => {
      setAccount(() => {
        return resp.data
      })
      setAccountRank(resp.data.rank)
      setAccountLevel(resp.data.level)
      setAccountRollCall(resp.data.roll_call)
      setAccountPastRank((prev) => {
        let next = {...prev}
        for (let i = 1; i <= 5; i ++) {
          next[i] = resp.data[`rank_${i}`]
        }
        return next
      })
    })
    .catch(resp => handleServerError(resp.response.status))
  }, [userId])

  function setRank(e) {
    e.preventDefault()
    document.getElementsByClassName('create-account-form__rank')[0].innerHTML = e.target.className
    setAccountRank(e.target.className)
    if (e.target.className == 'VAL' || e.target.className == 'Teacher') {
      setAccountHonorific('Mr')
    }
  }

  function setPastRank(level, e) {
    e.preventDefault()
    document.getElementsByClassName(`rank_${level}`)[0].innerHTML = e.target.className
    setAccountPastRank((prev) => {
      let next = {...prev}
      next[level] = e.target.className
      return next
    })
  }

  function setLevel(e) {
    e.preventDefault()
    document.getElementsByClassName('create-account-form__level')[0].innerHTML = e.target.className
    setAccountLevel(e.target.className)
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

  function editAccount(e) {
    e.preventDefault()
    let level = null
    let credentials = null
    let submit = true
    let password = null
    if (cookies.get('Type') == 'Admin') {
      password = e.target.elements['password'].value
      if (password == '') submit = false
    }
    if (account.account_type == "Boy") {
      level = accountLevel
      if (isNaN(parseInt(level))) submit = false
    } else {
      credentials = e.target.elements['credentials'].value
      if (credentials == '') submit = false
    }
    if (e.target.elements['account_name'].value == '') submit = false
    
    if (submit) {
      axios.post('/api/account/' + account.id + '/edit_account', {
        id: account.id,
        account_name: e.target.elements['account_name'].value,
        user_name: e.target.elements['user_name']?.value || null,
        abbreviated_name: e.target.elements['abbreviated_name'].value,
        password: password,
        account_type: e.target.elements['account_type'].value,
        rank: accountRank,
        rank_1: accountPastRank[1],
        rank_2: accountPastRank[2],
        rank_3: accountPastRank[3],
        rank_4: accountPastRank[4],
        rank_5: accountPastRank[5],
        level: level,
        class_1: e.target.elements['class_1']?.value,
        class_2: e.target.elements['class_2']?.value,
        class_3: e.target.elements['class_3']?.value,
        class_4: e.target.elements['class_4']?.value,
        class_5: e.target.elements['class_5']?.value,
        honorifics: accountHonorific,
        roll_call: accountRollCall,
        credentials: credentials
      }, {
        withCredentials: true
      })
      .then(resp => {
        if (resp.data != false) {
          alert("Account has been updated. If the change does not register please refresh the page to update user list")
          reLoad()
        }
        else alert("Failed to update")
      })
      .catch(resp => handleServerError(resp.response.status))      
    }
    else alert("Please fill in all fields first")
  }

  function deleteAccount(e) {
    e.preventDefault()
    axios.post('/api/account/0/delete_account', {
      account_name: account.account_name
    }, {
      withCredentials: true
    })
    .then(resp => {
      if (resp.data != false) {
        // Deletion failed
        // Reload the users list on the side and reset back to account creation form
        showForm()
        reLoad()
      }
      else{
        // Deletion success
        alert("Account has been deleted. If you still see the user in the list on the left, please refresh the page!")
        showForm()
        reLoad()
      }
    })
    .catch(resp => handleServerError(resp.response.status))
  }

  return(
    <div className='user-information'>
      {account != null && <form className="edit-account-form" onSubmit={editAccount}>
        <label>Rank: </label>
        {account.account_type == "Officer" && <Popup className='account-rank-popup' trigger={<label className='create-account-form__rank'>{account.rank}</label>} position="bottom">
          <p className='LTA' onClick={setRank}>LTA</p>
          <p className='2LT' onClick={setRank}>2LT</p>
          <p className='OCT' onClick={setRank}>OCT</p>
          <p className='VAL' onClick={setRank}>VAL</p>
          <p className='Teacher' onClick={setRank}>Teacher</p>
        </Popup>}
        {account.account_type == "Primer" && <Popup className='account-rank-popup' trigger={<label className='create-account-form__rank'>{account.rank}</label>} position="bottom">
          <p className='SCL' onClick={setRank}>SCL</p>
          <p className='CLT' onClick={setRank}>CLT</p>
        </Popup>}
        {account.account_type == "Boy" && <Popup className='account-rank-popup' trigger={<label className='create-account-form__rank'>{account.rank}</label>} position="bottom">
          <p className='WO' onClick={setRank}>WO</p>
          <p className='SSG' onClick={setRank}>SSG</p>
          <p className='SGT' onClick={setRank}>SGT</p>
          <p className='CPL' onClick={setRank}>CPL</p>
          <p className='LCP' onClick={setRank}>LCP</p>
          <p className='PTE' onClick={setRank}>PTE</p>
          <p className='REC' onClick={setRank}>REC</p>
        </Popup>}
        
        <br/>
        <label>Name: </label>
        <input className='edit-field' name={"account_name"} defaultValue={account.account_name}></input>
        {cookies.get("Type") == 'Admin' && <br/>}
        {cookies.get("Type") == 'Admin' && <label>User Name: </label>}
        {cookies.get("Type") == 'Admin' && <input className='edit-field' name={"user_name"} defaultValue={account.user_name}></input>}
        
        <br/>
        <label>Abbreviated Name: </label>
        <input className='edit-field' name={"abbreviated_name"} defaultValue={account.abbreviated_name}></input>
        
        <br/>
        <label>Account Type: </label>
        <input className='edit-field' name={"account_type"} defaultValue={account.account_type} disabled></input>
        {cookies.get("Type") == 'Admin' && <br/>}
        {cookies.get("Type") == 'Admin' && <label>Password: </label>}
        {cookies.get("Type") == 'Admin' && <input name={"password"} className='edit-field' defaultValue={account.password}></input>}
        
        {(account.rank == "Teacher" || account.rank == 'VAL') && <br/>}
        {(account.rank == "Teacher" || account.rank == 'VAL') && <label>Honorifics: </label>}
        {(account.rank == "Teacher" || account.rank == 'VAL') && <Popup className='account-honorific-popup' trigger={<label className='create-account-form__honorific'>{account.honorifics? account.honorifics : '-'}</label>} position="bottom">
          <p className='Mr' onClick={setHonorific}>Mr</p>
          <p className='Ms' onClick={setHonorific}>Ms</p>
          <p className='Mrs' onClick={setHonorific}>Mrs</p>
        </Popup>}

        {account.account_type == "Boy" && <br/>}
        {account.account_type == "Boy" && <label>Sec </label>}
        {account.account_type == "Boy" && <Popup className='account-level-popup' trigger={<label className='create-account-form__level'>{account.level}</label>} position="bottom">
          <p className='5' onClick={setLevel}>5</p>
          <p className='4' onClick={setLevel}>4</p>
          <p className='3' onClick={setLevel}>3</p>
          <p className='2' onClick={setLevel}>2</p>
          <p className='1' onClick={setLevel}>1</p>
        </Popup>}

        {account.account_type == "Boy" && (() => {
          const level = parseInt(accountLevel);
          if (!isNaN(level)) {
            return Array.from({ length: level }, (level, i) => (
              <div key={i}>
                {<br/>}
                {<label>Sec {i + 1} Class: </label>}
                {<input name={"class_" + (i + 1)} defaultValue={account[`class_${i + 1}`] || ""}></input>}
              </div>
            ))
          }
        })()}

        {account.account_type == "Boy" && (() => {
          const level = parseInt(accountLevel);
          if (!isNaN(level)) {
            return Array.from({ length: level - 1 }, (level, i) => (
              <div key={i}>
                {<br/>}
                {<label>What was this Boys rank at the end of Sec {i + 1}: </label>}
                {<Popup className='account-rank-popup' trigger={<label className={`rank_${i + 1}`}>{account[`rank_${i + 1}`] || "-"}</label>} position="bottom">
                  <p className='WO' onClick={(e) => {setPastRank(i + 1, e)}}>WO</p>
                  <p className='SSG' onClick={(e) => {setPastRank(i + 1, e)}}>SSG</p>
                  <p className='SGT' onClick={(e) => {setPastRank(i + 1, e)}}>SGT</p>
                  <p className='CPL' onClick={(e) => {setPastRank(i + 1, e)}}>CPL</p>
                  <p className='LCP' onClick={(e) => {setPastRank(i + 1, e)}}>LCP</p>
                  <p className='PTE' onClick={(e) => {setPastRank(i + 1, e)}}>PTE</p>
                  <p className='REC' onClick={(e) => {setPastRank(i + 1, e)}}>REC</p>
                </Popup>}
              </div>
            ))
          }
        })()}

        {(cookies.get("Type") == 'Admin' || cookies.get("Type") == 'Officer' || cookies.get("Appointment") == 'CSM') &&
         <br/>}
        {(cookies.get("Type") == 'Admin' || cookies.get("Type") == 'Officer' || cookies.get("Appointment") == 'CSM') &&
         <label>Should this user appear in the attendance nominal roll? : </label>}
        {(cookies.get("Type") == 'Admin' || cookies.get("Type") == 'Officer' || cookies.get("Appointment") == 'CSM') &&
         <Popup className='account-roll-call-popup' trigger={<label className='create-account-form__roll-call'>{account.roll_call? 'Yes' : 'No'}</label>} position="bottom">
          <p className='Yes' onClick={setRollCall}>Yes</p>
          <p className='No' onClick={setRollCall}>No</p>
        </Popup>}
        
        {account.appointment != null && <br/>}
        {account.appointment != null && <label>Appointment: </label>}
        {account.appointment != null && <label>{account.appointment}</label>}
        
        {account.account_type != "Boy" && <br/>}
        {account.account_type != "Boy" && <label>Credentials (For 32A results): </label>}
        {account.account_type != "Boy" && <input name={"credentials"} defaultValue={account.credentials}></input>}
        <button className="edit-button">Save Changes</button>
      </form>}
      <button className="delete-button" onClick={deleteAccount}>Delete Account</button>
    </div>
  )
}

UserInformation.propTypes ={
  userId: PropTypes.string.isRequired,
  showForm: PropTypes.func.isRequired,
  reLoad: PropTypes.func.isRequired
}

export { UserInformation }