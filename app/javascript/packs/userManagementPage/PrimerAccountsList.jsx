import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// Display list of all primer Accounts
const PrimerAccountsList = ({ setPageState, load }) => {
  const [primerList, setPrimerList] = useState([])

  useEffect(() => {
    loadList()
  }, [load])
  
  function loadList() {
    axios.post('/api/account/0/get_accounts_by_type', {
      account_type: "Primer"
    }, {
      withCredentials: true
    })
    .then(resp => {
      setPrimerList(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
  }

  function showUser(e) {
    e.preventDefault()
    setPageState(e.target.className)
  }

  return(
    <div className='primer-accounts-list'>
      {primerList.map((primer) => {
        return(
          <button key={primer.id} onClick={showUser} className={primer.id}>{primer.account_type} {primer.rank} {primer.account_name}</button>
        )
      })}
    </div>
  )
}

PrimerAccountsList.propTypes = {
  setPageState: PropTypes.func.isRequired
}

export { PrimerAccountsList }