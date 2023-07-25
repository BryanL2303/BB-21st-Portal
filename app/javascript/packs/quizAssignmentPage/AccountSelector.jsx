import React, {useState, useEffect, useContext} from 'react'
import Popup from 'reactjs-popup';
import axios from 'axios'
import Cookies from 'universal-cookie';

/*To display the currently selected question for the test
*/
const AccountSelector = ({account}) => {
  const cookies = new Cookies();

  return(
    <div className='account-display'>
      <input type='checkbox' value={account.id}></input>
      <label>{account.account_name}</label>
    </div>
  )
}

export { AccountSelector }