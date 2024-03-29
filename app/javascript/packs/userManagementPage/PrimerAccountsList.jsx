import React, { useEffect, useState, useContext } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'

/*Display list of all primer Accounts
*/
const PrimerAccountsList = ({setPageState}) => {
  const cookies = new Cookies()
  const [primerList, setPrimerList] = useState([])

  //If there is no ongoing session go to login page
  useEffect(() => {
    if (cookies.get('Token') == null) {
      window.location.href = '/'
    } else {
      loadList()
    }
  }, [])

  //Sends the information from the form to the backend to try and create an account
  //If the username is not unique returns an alert back to the user
  function loadList() {
    axios.post('/api/account/0/get_accounts', {
      account_type: "Primer"
    })
    .then(resp => {
      setPrimerList(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function showUser(e) {
    e.preventDefault()
    setPageState(e.target.className)
  }

  return(
    <div className='primer-accounts-list'>
      {primerList.map((primer) => {
        return(
          <button onClick={showUser} className={primer.id}>{primer.account_type} {primer.rank} {primer.account_name}</button>
        )
      })}
    </div>
  )
}

export { PrimerAccountsList }