import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'
import { handleServerError } from '../general/handleServerError'
import {QuestionGradingDisplay} from './QuestionGradingDisplay'

/*For officers/primers to grade assignments
*/
const AssignmentGradingPage = () => {
  const [attempt, setAttempt] = useState('1');
  const [account, setAccount] = useState();
  const [assignedAccount, setAssignedAccount] = useState();
  const [quiz, setQuiz] = useState();
  const [questions, setQuestions] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0)
  const { id } = useParams();

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then()
  .catch(() => {window.location.href = '/'})

  useEffect(() => {
    //make axios call and set Quiz and Questions
    axios.post('/api/assigned_account/' + id + '/get_assignment_answers', {
      'id': id,
      'attempt': attempt
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setAccount(resp.data['account'])
      setAssignedAccount(resp.data['assigned_account'])
      setQuiz(resp.data['quiz'])
      setQuestions(resp.data['questions'])
      setTotalMarks(resp.data['attempt_score'])
    })
    .catch(resp => handleServerError(resp.response.status))
  }, [attempt])

  function loadAttempt(e) {
    e.preventDefault()
    setQuestions([])
    setAttempt(e.target.innerHTML)
  }

  function setGraded(e) {
    e.preventDefault()
    axios.post('/api/assigned_account/' + id + '/set_graded', {
      'attempt_score_id': totalMarks.id
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setTotalMarks(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
  }

  return(
    <div className="assignment-grading-page">
      <NavigationBar/>
      <div className='page-container'>
        {account != null && <h1>{account.account_name}</h1>}
        {quiz != null && <h2>{quiz.quiz_name}</h2>}
        {!totalMarks.graded && <p>This attempt has not been graded yet</p>}
        {totalMarks.graded && <p>This attempt has been graded</p>}
        {quiz != null && <h2>{totalMarks.score} / {quiz.marks}</h2>}
        {attempt != null && <h2>Attempt {attempt}</h2>}
        {assignedAccount != null && parseInt(assignedAccount.attempts) > 0 && <div className='attempt-selector'>
          <label>View Attempt: </label>
          {[...Array(parseInt(assignedAccount.attempts)).keys()].map((iteration) => {
            if (attempt == (iteration + 1)) {
              return(
                <button key={iteration} className='selected' disabled onClick={loadAttempt}>{iteration + 1}</button>
              )
            }
            else {
              return(
                <button key={iteration} onClick={loadAttempt}>{iteration + 1}</button>
              )
            }
          })}
        </div>}
        {questions.map((question) => {
          return(
            <QuestionGradingDisplay key={"question-"+question.id} question={question}/>
          )
        })}
        {!totalMarks.graded && <button onClick={setGraded}>Mark attempt as graded</button>}
      </div>
    </div>
  )
}

export { AssignmentGradingPage }