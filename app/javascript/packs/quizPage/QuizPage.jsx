import React, { useEffect, useState, useContext } from 'react'
import Popup from 'reactjs-popup';
import { useParams } from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'
import {QuestionDisplay} from './QuestionDisplay'
import * as XLSX from 'xlsx'

/*For boys to attempt quizzes
*/
const QuizPage = () => {
  const cookies = new Cookies()
  const [quiz, setQuiz] = useState();
  const [questions, setQuestions] = useState([]);
  const [assignedAccount, setAssignedAccount] = useState();
  const [attemptScore, setAttemptScore] = useState();
  const { id } = useParams()

  /*let reader = new FileReader();
  reader.readAsArrayBuffer(worksheet)
  reader.onload((e) => {
    setExcelFile(e.target.result)
    console.log(e.target.result)
  })*/

  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
  }

  useEffect(() => {
    //make axios call and set Quiz and Questions
    axios.post('/api/quiz/' + id + '/get_quiz', {
      'id': id
    })
    .then(resp => {
      setQuiz(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
    axios.post('/api/quiz/0/get_questions', {
      'quiz_id': id
    })
    .then(resp => {
      console.log(resp.data)
      setQuestions(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
    axios.post('/api/assignment/0/get_assignment', {
      'token': cookies.get('Token'),
      'quiz_id': id,
      'id': '0'
    })
    .then(resp => {
      setAssignedAccount(resp.data['assigned_account'])
      setAttemptScore(resp.data['attemptScore'])
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  function submitQuiz(e) {
    e.preventDefault()
    console.log("Submit")
    let i = 0
    let answers = []
    let selected = []
    let currentQuestion = -1
    while (e.target[i] != null) {
      if (e.target[i].name != currentQuestion) {
        if (currentQuestion != -1) {
          answers.push({'question_id': currentQuestion, 'selected': selected})
          selected = []
        }
        currentQuestion = e.target[i].name
        if (e.target[i].type == 'radio' || e.target[i].type == 'checkbox') {
          if (e.target[i].checked) {
            selected.push(e.target[i].value)
          }          
        } else {
          selected = e.target[i].value
        }
      } else {
        if (e.target[i].type == 'radio' || e.target[i].type == 'checkbox') {
          if (e.target[i].checked) {
            selected.push(e.target[i].value)
          }          
        } else {
          selected = e.target[i].value
        }
      }
      i++
    }
    axios.post('/api/assignment/0/submit_assignment', {
      'token': cookies.get('Token'),
      'quiz_id': id,
      'answers': answers
    })
    .then(resp => {
      window.location.href = '/quiz_result/' + id
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <div className='quiz-page'>
      <NavigationBar/>
      <div className='page-container'>
        {quiz != null && <div className="quiz">
          <h2>{quiz.quiz_name}</h2>
          <p>Total marks: {quiz.marks}</p>
        </div>}
        {quiz == null && <p>Some how quiz is null</p>}
        <form onSubmit={submitQuiz}>
          {questions.map((question) => {
            return(
              <div className="question">
                <QuestionDisplay questionId={question.id}/>
              </div>
            )
          })}
          
          <button>Submit Quiz</button>
        </form>
      </div>
    </div>
  )
}

export { QuizPage }