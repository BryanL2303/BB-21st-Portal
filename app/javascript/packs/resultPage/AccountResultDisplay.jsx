import React, { useState, useEffect } from 'react'
import axios from 'axios'

/*To display the currently selected question for the test
*/
const AccountResultDisplay = ({assignedAccount}) => {
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
    .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  return(
    <tr className='assigned-account'>
      {account != null && <td className="name">{account.account_name}</td>}
      {assignedAccount != null && <td className="score">{assignedAccount.score}</td>}
    </tr>
  )
}

export { AccountResultDisplay }