import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// Display list of all officer Accounts
const OfficerAccountsList = ({ setPageState, load }) => {
  const [officerList, setOfficerList] = useState([])

  useEffect(() => {
    loadList()
  }, [load])

  function loadList() {
    axios.post('/api/account/0/get_accounts_by_type', {
      account_type: "Officer"
    }, {
      withCredentials: true
    })
    .then(resp => {
      setOfficerList(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
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
  setPageState: PropTypes.func.isRequired,
  load: PropTypes.bool.isRequired
}

export { OfficerAccountsList }