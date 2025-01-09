import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { McqOptionsForm } from '../questionBankPage/McqOptionsForm'
import { MrqOptionsForm } from '../questionBankPage/MrqOptionsForm'
import { OpenEndedForm } from '../questionBankPage/OpenEndedForm'

/*To create new questions and add them into the question bank
*/
const NewQuizQuestionForm = ({type, marks, setMarks}) => {
  const [localMark, setLocalMark] = useState(0)

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .catch(() => {window.location.href = '/'})

  function changeLocalMarks(e) {
    e.preventDefault()
    if (!isNaN(+e.target.value)) {
      // This is an integer
      let disparity = e.target.value - localMark
      setMarks(marks + disparity)
      setLocalMark(e.target.value)
    }
  }

  return(
    <div className='create-question-form'>
      <label>Question: </label>
      <input className='create-question-form__question' placeholder='question'></input>
      <br/>
      <label>Marks: </label>
      <input className='create-question-form__marks' onChange={changeLocalMarks} placeholder='marks'></input>
      {type == "MCQ" && <McqOptionsForm/>}
      {type == "MRQ" && <MrqOptionsForm/>}
      {type == "Open-ended" && <OpenEndedForm/>}
    </div>
  )
}

NewQuizQuestionForm.propTypes = {
  type: PropTypes.string.isRequired,
  marks: PropTypes.number.isRequired,
  setMarks: PropTypes.func.isRequired
}

export { NewQuizQuestionForm }