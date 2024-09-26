import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

/*Display list of Boy Accounts
*/
const BoyAccountsList = ({setPageState}) => {
  const [boyList, setBoyList] = useState([])

  //If there is no ongoing session go to login page
  useEffect(() => {
    loadList()
  }, [])

  //Sends the information from the form to the backend to try and create an account
  //If the username is not unique returns an alert back to the user
  function loadList() {
    axios.post('/api/account/0/get_accounts', {
      account_type: "Boy"
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setBoyList(resp.data)
    })
    .catch(error => {console.log(error)})
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

BoyAccountsList.propTypes = PropTypes.shape({
  setPageState: PropTypes.func.isRequired
})

export { BoyAccountsList }