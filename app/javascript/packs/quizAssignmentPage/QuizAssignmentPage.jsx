import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { AwardContext } from '../context/AwardContext'
import {NavigationBar} from '../general/NavigationBar'
import {AccountSelector} from './AccountSelector'

/*To assign quiz to boys
*/
const QuizAssignmentPage = () => {
  const [award] = useContext(AwardContext)
  const [quiz, setQuiz] = useState()
  const [accounts, setAccounts] = useState([])
  const { id } = useParams()
  const [limiter, setLimiter] = useState(false)

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then()
  .catch(() => {window.location.href = '/'})

  useEffect(() => {
    //make axios call and set Quiz and accounts
    axios.post('/api/quiz/' + id + '/get_quiz', {
      'id': id
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setQuiz(resp.data)
    })
    .catch(error => {console.log(error)})
    axios.post('/api/account/0/get_accounts', {
      'account_type': 'Boy'
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setAccounts(resp.data)
    })
    .catch(error => {console.log(error)})
  }, [])

  //Sends the information from the form to the backend to create assignment
  //If the form is not fully filled returns an alert to the user
  function createAssignment(e) {
    e.preventDefault()
    let accounts = []
    let i = 0
    let showAnswer = false
    let attemptLimit = 0
    if (e.target[1].checked) {
      attemptLimit = e.target[2].value
      showAnswer = e.target[3].checked
      i = 4
    } else {
      showAnswer = e.target[2].checked
      i = 3
    }
    while (e.target[i] != null) {
      if (e.target[i].checked) {
        accounts.push(e.target[i].value)
      }
      i++
    }
    axios.post('/api/assignment/0/create_assignment', {
      'quiz_id': id,
      'award': award,
      'accounts': accounts,
      'assignment_name': e.target[0].value,
      'show_answer': showAnswer,
      'attempt_limit': attemptLimit
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(() => window.location.href = '/quiz_bank')
    .catch(error => {console.log(error)})
  }

  function quizBankPage(e) {
    e.preventDefault()
    window.location.href = '/quiz_bank'
  }

  function limitAttempts() {
    if (limiter) {
      setLimiter(false)
    } else {
      setLimiter(true)
    }
  }

  return(
    <div className='quiz-assignment-page'>
      <NavigationBar/>
      <div className='page-container'>
        {quiz != null && <div>
          <h2>{quiz.quiz_name}</h2>
          <p>Total marks: {quiz.marks}</p>
        </div>}
        {quiz == null && <p>Some how quiz is null</p>}
        {quiz!= null && <form onSubmit={createAssignment}>
          <label>Name of the assignment: </label>
          <input defaultValue={quiz.quiz_name}></input>
          <br/>
          <label>Limit the number of times Boys can attempt the quiz: </label>
          <input type='checkbox' onClick={limitAttempts}></input>
          <br/>
          {limiter && <div>
            <label>How many times can each Boy attempt the quiz?</label>
            <input className="limiter-input" defaultValue={3}></input>
           </div>}
          <label>Do you want to show the boys the answers after they attempt the quiz?</label>
          <input type='checkbox'></input>
          <p>Pick the Boys to assign this quiz to</p>
          {accounts.map((account) => {
            return(
              <AccountSelector key={account.id} account={account}/>
            )
          })}
          <button>Assign quiz</button>
        </form>}
        <button onClick={quizBankPage}>Return to Quiz Bank</button>
      </div>
    </div>
  )
}

export { QuizAssignmentPage }