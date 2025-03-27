import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// To view users information and delete user accounts
const UserInformation = ({accountType, appointment, userId, showForm, reLoad}) => {
  const [account, setAccount] = useState();
  const [accountRank, setAccountRank] = useState();
  const [accountLevel, setAccountLevel] = useState();
  const [accountClass, setAccountClass] = useState();
  const [accountGraduated, setAccountGraduated] = useState(false);
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
      setAccountRank(resp.data.rank ? resp.data.rank : null)
      setAccountLevel(resp.data.level)
      setAccountClass(resp.data.class1)
      setAccountGraduated(resp.data.graduated)
      setAccountHonorific(resp.data.honorifics)
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
    setAccountRank(e.target.value !== "NIL" ? e.target.value: null)
    if (account.account_type == 'Boy') {
      setAccountPastRank((prev) => {
        let next = {...prev}
        next[accountLevel] = e.target.value
        return next
      })
    }
  }

  function setPastRank(level, e) {
    setAccountPastRank((prev) => {
      let next = {...prev}
      next[level] = e.target.value
      return next
    })
  }

  function setLevel(e) {
    setAccountLevel(e.target.value)
    if (account.account_type == 'Boy') {
      setAccountPastRank((prev) => {
        let next = {...prev}
        next[parseInt(e.target.value)] = accountRank
        for (let i = parseInt(e.target.value) + 1; i <= 5; i ++) {
          next[i] = null
        }
        return next
      })
    }
  }

  function setGraduated(e) {
    setAccountGraduated(e.target.value === "Yes")
    setAccountRollCall(account.roll_call)
  }

  function editAccount(e) {
    e.preventDefault()
    let level = null
    let credentials = null
    let submit = true
    let password = null
    if (accountType == 'Admin') {
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
        member_id: e.target.elements['member_id']?.value,
        rank: accountRank,
        rank1: accountPastRank[1],
        rank2: accountPastRank[2],
        rank3: accountPastRank[3],
        rank4: accountPastRank[4],
        rank5: accountPastRank[5],
        level: level,
        graduated: accountGraduated,
        class1: e.target.elements['account_type']?.value === "Officer" ? accountClass: e.target.elements['class_1']?.value,
        class2: e.target.elements['class_2']?.value,
        class3: e.target.elements['class_3']?.value,
        class4: e.target.elements['class_4']?.value,
        class5: e.target.elements['class_5']?.value,
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
      <h2>User - {account ? account.account_name : ''}</h2>

      {account != null && 
      <form className="edit-account-form" id='edit-account-form' onSubmit={editAccount} data-testid='user-information-form'>
        <label htmlFor='name-input'>Name:</label>
        <input className='edit-field' id='name-input' name={"account_name"} defaultValue={account.account_name} placeholder='Enter Name' />
        
        {accountType == 'Admin' && <>
          <label htmlFor='user-name-input'>User Name:</label>
          <input className='edit-field' id='user-name-input' name={"user_name"} defaultValue={account.user_name} placeholder='Enter User Name' />
        </>}
        
        <label htmlFor='abb-name-input'>Abbreviated Name: </label>
        <input className='edit-field' id='abb-name-input' name={"abbreviated_name"} defaultValue={account.abbreviated_name} placeholder='Enter Abbreviated Name' />
        
        {accountType == 'Admin' && <>
          <label htmlFor='password-input'>Password:</label>
          <input name={"password"} className='edit-field' defaultValue={account.password} id='password-input' placeholder='Enter Password' />
        </>}

        <label htmlFor='account-type-input'>Account Type:</label>
        <select id="account-type-input" defaultValue={account.account_type} name='account_type' disabled>
          <option value={account.account_type}>{account.account_type}</option>
        </select>

        <label htmlFor='rank-input'>Rank:</label>
        <select id="rank-input" defaultValue={account.rank} onChange={setRank}>
          {account.account_type === "Officer" && <>
            <option value="NIL">Not Applicable</option>
            <option value="OCT">OCT</option>
            <option value="2LT">2LT</option>
            <option value="LTA">LTA</option>
          </>}
          {account.account_type === "Primer" && <>
            <option value="NIL">Not Applicable</option>
            <option value="CLT">CLT</option>
            <option value="SCL">SCL</option>
          </>}
          {account.account_type === "Boy" && <>
            <option value="REC">REC</option>
            <option value="PTE">PTE</option>
            <option value="LCP">LCP</option>
            <option value="CPL">CPL</option>
            <option value="SGT">SGT</option>
            <option value="SSG">SSG</option>
            <option value="WO">WO</option>
          </>}
        </select>

        {(["Admin", "Officer"].includes(accountType) || appointment == 'CSM') && !accountGraduated && <>
          <label htmlFor='attendance-appearance'>Attendance Appearance:</label>
          <select id="attendance-appearance" defaultValue={account.roll_call} onChange={(e) => setAccountRollCall(e.target.value === 'Yes')}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </>}

        {account.account_type == "Boy" && <>
          <label htmlFor='member-id-input'>Member ID:</label>
          <input name="member_id" id='member-id-input' defaultValue={account.member_id} placeholder='Enter Member ID' />
        </>}

        {account.account_type == "Boy" && !accountGraduated && <>
          <label htmlFor='secondary-input'>Secondary:</label>
          <select id="secondary-input" onChange={setLevel} defaultValue={account.level}>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
        </>}

        {account.account_type == "Boy" && (() => {
          const level = parseInt(accountLevel);
          if (!isNaN(level)) {
            return Array.from({ length: level }, (_, i) => (
              <React.Fragment key={i}>
                <label htmlFor={`sec-${i + 1}-class`}>Sec {i + 1} Class:</label>
                <input id={`sec-${i + 1}-class`} name={"class_" + (i + 1)} defaultValue={account[`class_${i + 1}`] || ""} placeholder={`Enter Sec ${i + 1} Class`} />
              </React.Fragment>
            ))
          }
        })()}

        {account.account_type == "Boy" && (() => {
          const level = parseInt(accountLevel);
          if (!isNaN(level)) {
            return Array.from({ length: level - 1 }, (_, i) => (
              <React.Fragment key={i}>
                <label htmlFor={`sec-${i + 1}-rank`}>End of Sec {i + 1} Rank:</label>
                <select id={`sec-${i + 1}-rank`} onChange={(e) => setPastRank(i + 1, e)} defaultValue={account[`rank_${i + 1}`] || ""}>
                  <option value="" disabled>-</option>
                  <option value="REC">REC</option>
                  <option value="PTE">PTE</option>
                  <option value="LCP">LCP</option>
                  <option value="CPL">CPL</option>
                  <option value="SGT">SGT</option>
                  <option value="SSG">SSG</option>
                  <option value="WO">WO</option>
                </select>
              </React.Fragment>
            ))
          }
        })()}

        {account.account_type == "Boy" && <>
          <label htmlFor='graduated-input'>Graduated:</label>
          <select id="graduated-input" defaultValue={account.graduated ? "Yes" : "No"} onChange={setGraduated}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </>}
        
        {account.appointment != null && <>
          <label htmlFor='appointment-input'>Appointment:</label>
          <input type="text" id='appointment-input' disabled defaultValue={account.appointment} />
        </>}

        {(account.class_1 == "STAFF" || accountRank == null) && <>
          <label htmlFor='honorific-input'>Honorifics:</label>
          <select id="honorific-input" onChange={(e) => setAccountHonorific(e.target.value)} defaultValue={account.honorifics || ""}>
            <option value="">-</option>
            <option value="Mr">Mr</option>
            <option value="Ms">Ms</option>
            <option value="Mrs">Mrs</option>
          </select>
        </>}

        {(account.account_type == "Primer" && account.rank == null) || account.account_type == "Officer" && <>
          <label htmlFor='class-input'>Class:</label>
          <select id="class-input" onChange={(e) => setAccountClass(e.target.value)} defaultValue={account.class_1} placeholder='Enter Class'>
            <option value="VAL">VAL</option>
            <option value="STAFF">STAFF</option>
            <option value="UNI">UNI</option>
            <option value="POLY">POLY</option>
          </select>
        </>}
        
        {account.account_type != "Boy" && <>
          <label htmlFor='credentials-input'>Credentials (For 32A results):</label>
          <input name="credentials" defaultValue={account.credentials} id='credentials-input' />
        </>}
      </form>}

      <div>
        <button className="edit-button" type='submit' form='edit-account-form'>Save Changes</button>
        <button className="delete-button" onClick={deleteAccount}>Delete Account</button>
      </div>
    </div>
  )
}

UserInformation.propTypes = {
  accountType: PropTypes.string,
  appointment: PropTypes.string,
  userId: PropTypes.string.isRequired,
  showForm: PropTypes.func,
  reLoad: PropTypes.func
}

export { UserInformation }