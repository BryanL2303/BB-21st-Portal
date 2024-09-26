import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

/*To display the currently selected question for the test
*/
const QuestionDisplay = ({questionId}) => {
  const [question, setQuestion] = useState()
  const [options, setOptions] = useState([])

  useEffect(() => {
    axios.post('/api/question/0/get_question', {
      question_id: questionId
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then( resp => {
      setQuestion(resp.data)
      if (resp.data.question_type == 'Open-ended') {
        axios.post('/api/question/0/get_rubric', {
          question_id: questionId
        }, {
          withCredentials: true  // Include credentials (cookies)
        })
        .then()
        .catch(error => {console.log(error)})
      } else {
        axios.post('/api/question/0/get_options', {
          question_id: questionId
        }, {
          withCredentials: true  // Include credentials (cookies)
        })
        .then( resp => {
          setOptions(resp.data)
        })
        .catch(error => {console.log(error)})
      }
    })
    .catch(error => {console.log(error)})
  }, [questionId])

  return(
    <div className='selected-question'>
      {question != null && <p>{question.question}</p>}
      {question != null && <p>{question.marks}</p>}
      {question != null && question.question_type == "MCQ" && options.map((option) => {
        return (
          <div key={option.id + "-mcq-option"}>
            <input id={question.id} type='radio' value={option.id} name={question.id}></input>
            <label id={question.id} className='question__option'>{option.answer}</label>
          </div>
        )
      })}
      {question != null && question.question_type == "MRQ" && options.map((option) => {
        return (
          <div key={option.id + "-mrq-option"}>
            <input id={question.id} type='checkbox' value={option.id} name={question.id}></input>
            <label id={question.id} className='question__option'>{option.answer}</label>
          </div>
        )
      })}
      {question != null && question.question_type == "Open-ended" && <textarea id={question.id} name={question.id}></textarea>}
    </div>
  )
}

QuestionDisplay.propTypes = PropTypes.shape({
  questionId: PropTypes.number.isRequired
})

export { QuestionDisplay }