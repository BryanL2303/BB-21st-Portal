import React, { useState } from 'react'
import Popup from 'reactjs-popup'
import PropTypes from 'prop-types'
import axios from 'axios'
import { QuestionSelector } from './QuestionSelector'
import { NewQuizQuestionForm } from './NewQuizQuestionForm'

/*To set questions and add them into the quiz
*/
const SetQuestionForm = ({number, setNumber, marks, setMarks}) => {
  const [exist, setExist] = new useState('true');
  const [type, setType] = new useState('');
  const [source, setSource] = new useState('');

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then()
  .catch(() => {window.location.href = '/'})

  function setQuestionType(e) {
    e.preventDefault()
    setType(e.target.className)
  }

  function setQuestionSource(e) {
    e.preventDefault()
    setSource(e.target.className)
  }

  function deleteQuestion(e) {
    e.preventDefault()
    setNumber(number - 1)
    setExist('false')
  }

  return(
    <div className='question-container'>
    {exist == 'true' && <div className='mcq-options-segment'>
      <br/>
      <label>Question Type: </label>
      <Popup className='question-type-popup' trigger={<input className='create-quiz-question__type' value={type}></input>} position="bottom">
        <p className='MCQ' onClick={setQuestionType}>MCQ</p>
        <p className='MRQ' onClick={setQuestionType}>MRQ</p>
        <p className='Open-ended' onClick={setQuestionType}>Open-ended</p>
      </Popup>
      <br/>
      {type != '' && <label>Use question from: </label>}
      {type != '' && <Popup className='question-source-popup' trigger={<input className='create-quiz-question__source' value={source}></input>} position="bottom">
        <p className='Question bank' onClick={setQuestionSource}>Question bank</p>
        <p className='Create new question' onClick={setQuestionSource}>Create new question</p>
      </Popup>}
      <br/>
      {source == 'Question bank' && <QuestionSelector type={type} marks={marks} setMarks={setMarks}/>}
      {source == 'Create new question' && <NewQuizQuestionForm type={type} marks={marks} setMarks={setMarks}/>}
      <button onClick={deleteQuestion}>Delete Question</button>
    </div>}
    </div>
  )
}

SetQuestionForm.propTypes = {
  number: PropTypes.number.isRequired,
  setNumber: PropTypes.func.isRequired,
  marks: PropTypes.number.isRequired,
  setMarks: PropTypes.func.isRequired,
}

export { SetQuestionForm }