import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// Display list of Boy Accounts
const BoyAccountsList = ({ setPageState, load }) => {
  const [boyList, setBoyList] = useState([])

  useEffect(() => {
    loadList()
  }, [load])

  function loadList() {
    axios.post('/api/account/0/get_accounts_by_type', {
      account_type: "Boy"
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setBoyList(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
  }

  function showUser(e) {
    e.preventDefault()
    setPageState(e.target.className)
  }

  return(
    <div className='boy-accounts-list'>
      {boyList.map((boy) => {
        return(
          <button key={boy.id} onClick={showUser} className={boy.id}>{boy.account_type} Sec {boy.level} {boy.rank} {boy.account_name}</button>
        )
      })}
    </div>
  )
}

BoyAccountsList.propTypes = {
  setPageState: PropTypes.func.isRequired
}

export { BoyAccountsList }