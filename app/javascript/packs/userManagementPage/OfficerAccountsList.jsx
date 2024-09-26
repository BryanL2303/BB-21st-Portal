import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

/*Display list of all officer Accounts
*/
const OfficerAccountsList = ({setPageState}) => {
  const [officerList, setOfficerList] = useState([])

  //If there is no ongoing session go to login page
  useEffect(() => {
    loadList()
  }, [])

  //Sends the information from the form to the backend to try and create an account
  //If the username is not unique returns an alert back to the user
  function loadList() {
    axios.post('/api/account/0/get_accounts', {
      account_type: "Officer"
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setOfficerList(resp.data)
    })
    .catch(error => {console.log(error)})
  }

  function showUser(e) {
    e.preventDefault()
    setPageState(e.target.className)
  }

  return(
    <div className='officer-accounts-list'>
      {officerList.map((officer) => {
        return(
          <button key={officer.id} onClick={showUser} className={officer.id}>{officer.account_type} {officer.rank} {officer.account_name}</button>
        )
      })}
    </div>
  )
}

OfficerAccountsList.propTypes = {
  setPageState: PropTypes.func.isRequired
}

export { OfficerAccountsList }