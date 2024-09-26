import React, { useState } from 'react'
import PropTypes from 'prop-types'

/*To display the currently selected question for the test
*/
const AnswerDisplay = ({question}) => {
  const [mark, setMark] = useState(0);
  const [markFound, setMarkFound] = useState(false);

  return(
    <div className='question-display'>
      <label>{question.question.question} - {mark}/{question.question.marks}</label>
      {question.question.question_type != "Open-ended" && question.answer.map((option) => {
        if (option.answer != null && !markFound) {
          setMarkFound(true)
          setMark(option.answer.score)
        }

        return(
          <div key={option.id}>
            <input type='checkbox' disabled defaultChecked={option.answer != null}></input>
            <label>{option.rubric.answer}</label>
          </div>
        )
      })}
      {question.question.question_type == "Open-ended" && !markFound && setMark(question.answer.answer[0]['score'])}
      {question.question.question_type == "Open-ended" && !markFound && setMarkFound(true)}
      {question.question.question_type == "Open-ended" && <label>Rubrics for question: </label>}
      {question.question.question_type == "Open-ended" && <br/>}
      {question.question.question_type == "Open-ended" && <textarea disabled defaultValue={question.answer.rubric[0]['rubric']}></textarea>}
      {question.question.question_type == "Open-ended" && <br/>}
      {question.question.question_type == "Open-ended" && <label>Boys answer: </label>}
      {question.question.question_type == "Open-ended" && <br/>}
      {question.question.question_type == "Open-ended" && <textarea disabled defaultValue={question.answer.answer[0]['answer']}></textarea>}
      {question.question.question_type == "Open-ended" && <br/>}
      {question.question.question_type == "Open-ended" && <div className='question-grading-form'>
        <label>Comments from grader: </label>
        <br/>
        <textarea disabled defaultValue={question.answer.answer[0]['comments']}></textarea>
        <br/>
      </div>}
    </div>
  )
}

AnswerDisplay.propTypes = {
  question: PropTypes.shape({
    question: PropTypes.shape({
      question_type: PropTypes.string.isRequired,
      question: PropTypes.string.isRequired,
      marks: PropTypes.number.isRequired
    }),
    answer: PropTypes.shape({
      rubric: PropTypes.arrayOf(PropTypes.shape({
        rubric: PropTypes.string.isRequired
      })),
      answer: PropTypes.arrayOf(propTypes.shape({
        answer: PropTypes.string.isRequired,
        score: PropTypes.number.isRequired
      }))
    })
  })
}

export { AnswerDisplay }