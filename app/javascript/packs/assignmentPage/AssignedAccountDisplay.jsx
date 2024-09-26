import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

/*To display the currently selected question for the test
*/
const AssignedAccountDisplay = ({ assignedAccount }) => {
  const [account, setAccount] = useState()

  useEffect(() => {
    axios.post('/api/account/' + assignedAccount.account_id + '/get_account_information', {
      'id': assignedAccount.account_id
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setAccount(resp.data)
    })
    .catch(error => console.log(error))
  }, [])

  return(
    <tr className='assigned-account'>
      {account != null && <td className="name">{account.account_name}</td>}
      {assignedAccount != null && <td className="attempts">{assignedAccount.attempts}</td>}
      {assignedAccount != null && <td className="score">{assignedAccount.score}</td>}
      {assignedAccount != null && parseInt(assignedAccount.attempts) > 0 && <td className="view-attempts"><a href={'/view_assignment/grade/' + assignedAccount.id}>view attempts</a></td>}
      {assignedAccount != null && parseInt(assignedAccount.attempts) == 0 && <td className="view-attempts"><label>no attempt yet</label></td>}
    </tr>
  )
}

AssignedAccountDisplay.propTypes = {
  assignedAccount: PropTypes.shape({
    id: PropTypes.number.isRequired,
    account_id:  PropTypes.number.isRequired,
    attempts: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired
  })
}

export { AssignedAccountDisplay }