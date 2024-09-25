import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'
import {QuestionDisplay} from './QuestionDisplay'

/*For boys to attempt quizzes
*/
const QuizPage = () => {
  const [quiz, setQuiz] = useState();
  const [questions, setQuestions] = useState([]);
  const { id } = useParams()

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then()
  .catch(() => {window.location.href = '/'})

  useEffect(() => {
    //make axios call and set Quiz and Questions
    axios.post('/api/quiz/' + id + '/get_quiz', {
      'id': id
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setQuiz(resp.data)
    })
    .catch(error => {console.log(error)})
    axios.post('/api/quiz/0/get_questions', {
      'quiz_id': id
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setQuestions(resp.data)
    })
    .catch(error => {console.log(error)})
    axios.post('/api/assignment/0/get_assignment', {
      'quiz_id': id,
      'id': '0'
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then()
    .catch(error => {console.log(error)})
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
      'quiz_id': id,
      'answers': answers
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(() => {
      window.location.href = '/quiz_result/' + id
    })
    .catch(error => {console.log(error)})
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
              <div key={question.id} className="question">
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