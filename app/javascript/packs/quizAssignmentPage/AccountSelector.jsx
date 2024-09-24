import React from 'react'

/*To display the currently selected question for the test
*/
const AccountSelector = ({account}) => {
  return(
    <div className='account-display'>
      <input type='checkbox' value={account.id}></input>
      <label>{account.account_name}</label>
    </div>
  )
}

export { AccountSelector }