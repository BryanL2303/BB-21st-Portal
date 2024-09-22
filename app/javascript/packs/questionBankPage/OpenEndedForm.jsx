import React, { useState, useContext } from 'react'
import Popup from 'reactjs-popup';
import Cookies from 'universal-cookie'
import axios from 'axios'

/*To create new questions and add them into the question bank
*/
const OpenEndedForm = () => {
  const cookies = new Cookies()

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then(resp => {})
  .catch(resp => {
    window.location.href = '/'
  })

  return(
    <div className='open-ended-segment'>
      <label>Give a general rubric for future assessment</label>
      <textarea className='open-ended__rubric'></textarea>
    </div>
  )
}

export { OpenEndedForm }