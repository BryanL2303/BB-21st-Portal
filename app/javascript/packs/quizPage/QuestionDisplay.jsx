import React, {useState, useEffect, useContext} from 'react'
import Popup from 'reactjs-popup';
import axios from 'axios'
import Cookies from 'universal-cookie';

/*To display the currently selected question for the test
*/
const QuestionDisplay = ({questionId}) => {
  const cookies = new Cookies();
  const [question, setQuestion] = useState()
  const [options, setOptions] = useState([])
  const [rubric, setRubric] = useState("")

  useEffect(() => {
    axios.post('/api/question/0/get_question', {
      question_id: questionId
    })
    .then( resp => {
      setQuestion(resp.data)
      if (resp.data.question_type == 'Open-ended') {
        axios.post('/api/question/0/get_rubric', {
          question_id: questionId
        })
        .then( resp => {
          setRubric(resp.data)
        })
        .catch(resp => errorMessage(resp.response.statusText))
      } else {
        axios.post('/api/question/0/get_options', {
          question_id: questionId
        })
        .then( resp => {
          setOptions(resp.data)
        })
        .catch(resp => errorMessage(resp.response.statusText))
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [questionId])

  return(
    <div className='selected-question'>
      {question != null && <p>{question.question}</p>}
      {question != null && <p>{question.marks}</p>}
      {question != null && question.question_type == "MCQ" && options.map((option) => {
        return (
          <div>
            <input type='radio' value={option.id} name={question.id}></input>
            <label id={question.id} className='question__option'>{option.answer}</label>
          </div>
        )
      })}
      {question != null && question.question_type == "MRQ" && options.map((option) => {
        return (
          <div>
            <input type='checkbox' value={option.id} name={question.id}></input>
            <label id={question.id} className='question__option'>{option.answer}</label>
          </div>
        )
      })}
      {question != null && question.question_type == "Open-ended" && options.map((option) => {
        return (
          <input></input>
        )
      })}
    </div>
  )
}

export { QuestionDisplay }