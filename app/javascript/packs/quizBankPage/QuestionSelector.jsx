import React, {useState, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { AwardContext } from '../context/AwardContext'
import { SelectedQuestion } from './SelectedQuestion.jsx'

/*To access questions from question bank and add them into the quiz
*/
const QuestionSelector = ({type, marks, setMarks}) => {
  const [award] = useContext(AwardContext)
  const [selected, setSelected] = useState(false)
  const [questions, setQuestions] = useState([])
  const [questionId, setQuestionId] = useState()

  useEffect(() => {
    axios.post('/api/question/0/get_questions', {
      award: award,
      question_type: type
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then( resp => {
      setQuestions(resp.data)
    })
    .catch(error => {console.log(error)})
  }, [type])

  function select(e) {
    e.preventDefault()
    setSelected(true)
    setQuestionId(e.target.className)
  }

  return(
    <div className='question-selector'>
      <h3>Select a question</h3>
      {selected == false && questions.map((question) => {
        return (
          <button key={question.id} className={question.id} onClick={select}>{question.question}</button>
        )
      })}
      {selected == true && <SelectedQuestion questionId={questionId} setQuestionId={setQuestionId} setSelected={setSelected} marks={marks} setMarks={setMarks}/>}
    </div>
  )
}

QuestionSelector.propTypes = PropTypes.shape({
  type: PropTypes.string.isRequired,
  marks: PropTypes.number.isRequired,
  setMarks: PropTypes.func.isRequired
})

export { QuestionSelector }