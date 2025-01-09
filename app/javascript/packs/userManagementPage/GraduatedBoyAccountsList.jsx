import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// Display list of Graduated Boy Accounts
const GraduatedBoyAccountsList = ({ setPageState, load }) => {
  const [graduatedBoyList, setGraduatedBoyList] = useState([])

  useEffect(() => {
    loadList()
  }, [load])

  function loadList() {
    axios.post('/api/account/0/get_graduated_accounts', {},
    {
      withCredentials: true
    })
    .then(resp => {
      setGraduatedBoyList(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
  }

  function showUser(e) {
    e.preventDefault()
    setPageState(e.target.className)
  }

  return(
    <div className='boy-accounts-list'>
      {graduatedBoyList.map((boy) => {
        return(
          <button key={boy.id} onClick={showUser} className={boy.id}>Graduated {boy.account_name}</button>
        )
      })}
    </div>
  )
}

GraduatedBoyAccountsList.propTypes = {
  setPageState: PropTypes.func.isRequired,
  load: PropTypes.bool.isRequired
}

export { GraduatedBoyAccountsList }