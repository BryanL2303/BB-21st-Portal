import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

/*Display list of all primer Accounts
*/
const PrimerAccountsList = ({setPageState}) => {
  const [primerList, setPrimerList] = useState([])

  //If there is no ongoing session go to login page
  useEffect(() => {
    loadList()
  }, [])

  //Sends the information from the form to the backend to try and create an account
  //If the username is not unique returns an alert back to the user
  function loadList() {
    axios.post('/api/account/0/get_accounts', {
      account_type: "Primer"
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setPrimerList(resp.data)
    })
    .catch(error => {console.log(error)})
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

PrimerAccountsList.propTypes = PropTypes.shape({
  setPageState: PropTypes.func.isRequired
})

export { PrimerAccountsList }