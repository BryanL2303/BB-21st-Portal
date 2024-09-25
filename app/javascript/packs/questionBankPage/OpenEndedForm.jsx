import React from 'react'
import axios from 'axios'

/*To create new questions and add them into the question bank
*/
const OpenEndedForm = () => {
  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then()
  .catch(() => {window.location.href = '/'})

  return(
    <div className='open-ended-segment'>
      <label>Give a general rubric for future assessment</label>
      <textarea className='open-ended__rubric'></textarea>
    </div>
  )
}

export { OpenEndedForm }