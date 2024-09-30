import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// To view users information and delete user accounts
const UserInformation = ({userId, showForm, reLoad}) => {
  const cookies = new Cookies()
  const [account, setAccount] = useState();
  const [accountRank, setAccountRank] = useState();
  const [accountLevel, setAccountLevel] = useState();

  useEffect(() => {
    axios.post('/api/account/' + userId + '/get_account_information', {
      'id': userId
    }, {
      withCredentials: true
    })
    .then(resp => {
      setAccount(resp.data)
      setAccountRank(resp.data.rank)
      setAccountLevel(resp.data.level)
    })
    .catch(resp => handleServerError(resp.response.status))
  }, [userId])

  function setRank(e) {
    e.preventDefault()
    document.getElementsByClassName('create-account-form__rank')[0].innerHTML = e.target.className
    setAccountRank(e.target.className)
  }

  function setLevel(e) {
    e.preventDefault()
    document.getElementsByClassName('create-account-form__level')[0].innerHTML = e.target.className
    setAccountLevel(e.target.className)
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
        password: password,
        account_type: e.target.elements['account_type'].value,
        rank: accountRank,
        level: level,
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
        // This means that the deletion failed
        // Reload the users list on the side and reset back to account creation form
        showForm()
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
        <br/>
        <label>Account Type: </label>
        <input className='edit-field' name={"account_type"} defaultValue={account.account_type} disabled></input>
        <br/>
        {cookies.get("Type") == 'Admin' && <label>Password: </label>}
        {cookies.get("Type") == 'Admin' && <input name={"password"} className='edit-field' defaultValue={account.password}></input>}
        <br/>
        {account.account_type == "Boy" && <label>Sec </label>}
        {account.account_type == "Boy" && <Popup className='account-level-popup' trigger={<label className='create-account-form__level'>{account.level}</label>} position="bottom">
          <p className='5' onClick={setLevel}>5</p>
          <p className='4' onClick={setLevel}>4</p>
          <p className='3' onClick={setLevel}>3</p>
          <p className='2' onClick={setLevel}>2</p>
          <p className='1' onClick={setLevel}>1</p>
        </Popup>}
        {account.account_type != "Boy" && <label>Credentials (For 32A results): </label>}
        {account.account_type != "Boy" && <input name={"credentials"} defaultValue={account.credentials}></input>}
        <button className="edit-button">Save Changes</button>
      </form>}
      <button className="delete-button" onClick={deleteAccount}>Delete Account</button>
    </div>
  )
}

UserInformation.propTypes ={
  userId: PropTypes.number.isRequired,
  showForm: PropTypes.func.isRequired,
  reLoad: PropTypes.func.isRequired
}

export { UserInformation }