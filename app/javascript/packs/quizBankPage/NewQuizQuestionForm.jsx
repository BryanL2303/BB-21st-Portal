import React, { useState, useContext } from 'react'
import Popup from 'reactjs-popup';
import Cookies from 'universal-cookie'
import axios from 'axios'
import { McqOptionsForm } from '../questionBankPage/McqOptionsForm'
import { MrqOptionsForm } from '../questionBankPage/MrqOptionsForm'
import { OpenEndedForm } from '../questionBankPage/OpenEndedForm'

/*To create new questions and add them into the question bank
*/
const NewQuizQuestionForm = ({type, marks, setMarks}) => {
  const cookies = new Cookies()
  const [localMark, setLocalMark] = useState(0)

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then(resp => {})
  .catch(resp => {
    window.location.href = '/'
  })

  function changeLocalMarks(e) {
    e.preventDefault()
    if (!isNaN(+e.target.value)) {
      console.log("This is an integer")
      let disparity = e.target.value - localMark
      setMarks(marks + disparity)
      setLocalMark(e.target.value)
    } else {
      console.log("This is not an integer")
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

export { NewQuizQuestionForm }