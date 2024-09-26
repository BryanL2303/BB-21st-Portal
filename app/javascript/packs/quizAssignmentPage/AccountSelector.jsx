import React from 'react'
import PropTypes from 'prop-types'

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

AccountSelector.propTypes = PropTypes.shape({
  account: PropTypes.shape({
    id: PropTypes.number.isRequired,
    account_name: PropTypes.string.isRequired
  })
})

export { AccountSelector }