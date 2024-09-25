import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'
import {AnswerDisplay} from './AnswerDisplay'

/*For Boys to see the results of their quiz
*/
const QuizResultPage = () => {
  const [quiz, setQuiz] = useState();
  const [attempt, setAttempt] = useState(1);
  const [totalMarks, setTotalMarks] = useState(0);
  const [assignment, setAssignment] = useState();
  const [accountAssignment, setAccountAssignment] = useState();
  const [questions, setQuestions] = useState([]);
  const [allowAttempt, setAllowAttempt] = useState(false);
  const { id } = useParams()

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then()
  .catch(() => {window.location.href = '/'})

  useEffect(() => {
    axios.post('/api/assigned_account/0/get_assigned_account', {
      'quiz_id': id
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setAttempt(resp.data['attempts'])
      setAccountAssignment(resp.data)
      axios.post('/api/assigned_account/' + resp.data['id'] + '/get_assignment_answers', {
        'id': resp.data['id'],
        'attempt': resp.data['attempts']
      }, {
        withCredentials: true  // Include credentials (cookies)
      })
      .then(resp => {
        //setAccount(resp.data['account'])
        //setAssignedAccount(resp.data['assigned_account'])
        setAssignment(resp.data['assignment'])
        setQuiz(resp.data['quiz'])
        setQuestions(resp.data['questions'])
        setTotalMarks(resp.data['attempt_score'])
        setAllowAttempt(resp.data['attempt_score']['graded'])
      })
      .catch(resp => errorMessage(resp.response.statusText))
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  //Go to QuizPage
  function quizPage () {
    window.location.href = '/quiz'
  }

  //View a quiz
  function viewQuiz(e) {
    e.preventDefault()
    window.location.href = '/quiz/' + e.target.className
  }

  function loadAttempt(e) {
    e.preventDefault()
    setQuestions([])
    setAttempt(e.target.innerHTML)
    axios.post('/api/assigned_account/' + accountAssignment['id'] + '/get_assignment_answers', {
      'id': accountAssignment['id'],
      'attempt': e.target.innerHTML
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setAssignment(resp.data['assignment'])
      setQuiz(resp.data['quiz'])
      setQuestions(resp.data['questions'])
      setTotalMarks(resp.data['attempt_score'])
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <div className='quiz-result-page'>
      <NavigationBar/>
      <div className='page-container'>
        {attempt != 0 && 
        <div> 
          {quiz != null && accountAssignment != null && 
          <div className="quiz-editor">
            <h2>{quiz.quiz_name}</h2>
            {accountAssignment != null && parseInt(accountAssignment.attempts) > 0 && 
            <div className='attempt-selector'>
              <label>View Attempt: </label>
              {[...Array(parseInt(accountAssignment.attempts)).keys()].map((iteration) => {
                if (attempt == (iteration + 1)) {
                  return(
                    <button className='selected' disabled onClick={loadAttempt}>{iteration + 1}</button>
                  )                  
                }
                else {
                  return(
                    <button onClick={loadAttempt}>{iteration + 1}</button>
                  )
                }
              })}
            </div>}
            {!totalMarks.graded && <p>This attempt has not been graded yet</p>}
            {totalMarks.graded && <p>This attempt has been graded</p>}
            <p>Current attempt score: {totalMarks.score} / {quiz.marks}</p>
            <p>Current attempts: {accountAssignment.attempts}</p>
            {parseInt(assignment.attempt_limit) != 0 && <p>Attempts allowed: {assignment.attempt_limit}</p>}
            {parseInt(assignment.attempt_limit) == 0 && <p>Attempts allowed: Unlimited</p>}
            <p>Current best score: {accountAssignment.score} / {quiz.marks}</p>
          </div>}
          <br/>
          {quiz == null && <p>Some how quiz is null</p>}
          {assignment != null && !assignment.show_answer && <p>The answers will not be shown for this assignment</p>}
          {assignment != null && assignment.show_answer && 
            questions.map((question) => {
              return(
                <AnswerDisplay question={question}/>
              )
          })}
        </div>}
        
        {attempt == 0 && assignment != null && <div>
          <p>Current attempts: {accountAssignment.attempts}</p>
          {parseInt(assignment.attempt_limit) != 0 && <p>Attempts allowed: {assignment.attempt_limit}</p>}
          {parseInt(assignment.attempt_limit) == 0 && <p>Attempts allowed: Unlimited</p>}
        </div>}

        {assignment != null && accountAssignment != null && (parseInt(assignment.attempt_limit) == 0 || parseInt(accountAssignment.attempts) < parseInt(assignment.attempt_limit)) && allowAttempt && <button className={quiz.id} onClick={viewQuiz}>Attempt Quiz</button>}
        <button onClick={quizPage}>Return to quiz list</button>
      </div>
    </div>
  )
}

export { QuizResultPage }