import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

/*To display the currently selected question from the question bank
*/
const SelectedQuestion = ({questionId, setQuestionId, setSelected, marks, setMarks}) => {
  const [question, setQuestion] = useState()
  const [options, setOptions] = useState([])
  const [rubric, setRubric] = useState("")

  useEffect(() => {
    axios.post('/api/question/0/get_question', {
      question_id: questionId
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then( resp => {
      setQuestion(resp.data)
      setMarks(marks + resp.data.marks)
      if (resp.data.question_type == 'Open-ended') {
        axios.post('/api/question/0/get_rubric', {
          question_id: questionId
        }, {
          withCredentials: true  // Include credentials (cookies)
        })
        .then( resp => {
          setRubric(resp.data.rubric)
        })
        .catch(resp => handleServerError(resp.response.status))
      } else {
        axios.post('/api/question/0/get_options', {
          question_id: questionId
        }, {
          withCredentials: true  // Include credentials (cookies)
        })
        .then( resp => {
          setOptions(resp.data)
        })
        .catch(resp => handleServerError(resp.response.status))
      }
    })
    .catch(resp => handleServerError(resp.response.status))
  }, [questionId])

  function reSelect(e) {
    e.preventDefault()
    setMarks(marks - question.marks)
    setQuestionId()
    setSelected(false)
  }

  return(
    <div className='selected-question'>
      {question != null && <p>{question.question}</p>}
      {question != null && <p>{question.mark}</p>}
      {question != null && question.question_type == "MCQ" && options.map((option) => {
        return (
          <div key={option.id + "-mcq-option"}>
            <input id={question.id} type='radio' value={option.id} name='option' disabled={true} checked={option.correct}></input>
            <input id={question.id} className='create-question-form__option' disabled={true} value={option.answer}></input>
          </div>
        )
      })}
      {question != null && question.question_type == "MRQ" && options.map((option) => {
        return (
          <div key={option.id + "-mrq-option"}>
            <input id={question.id} type='checkbox' value={option.id} name='option' disabled={true} checked={option.correct}></input>
            <input id={question.id} className='create-question-form__option' disabled={true} value={option.answer}></input>
          </div>
        )
      })}
      {question != null && question.question_type == "Open-ended" && <textarea id={question.id} disabled defaultValue={rubric}></textarea>}
      {marks != -100 && <button onClick={reSelect}>Pick a different question</button>}
    </div>
  )
}

SelectedQuestion.propTypes = {
  questionId: PropTypes.number.isRequired,
  setQuestionId: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
  marks: PropTypes.number.isRequired,
  setMarks: PropTypes.func.isRequired
}

export { SelectedQuestion }