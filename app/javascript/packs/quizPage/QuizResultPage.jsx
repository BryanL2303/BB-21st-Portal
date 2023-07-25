import React, { useEffect, useState, useContext } from 'react'
import Popup from 'reactjs-popup';
import { useParams } from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'

/*For Boys to see the results of their quiz
*/
const QuizResultPage = () => {
  const cookies = new Cookies()
  const [quiz, setQuiz] = useState();
  const [accountAssignment, setAccountAssignment] = useState();
  const [questions, setQuestions] = useState([]);
  const { id } = useParams()

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
      console.log(resp.data)
      setQuiz(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
    axios.post('/api/assigned_account/0/get_assigned_account', {
      'token': cookies.get("Token"),
      'quiz_id': id
    })
    .then(resp => {
      setAccountAssignment(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
    axios.post('/api/quiz/0/get_questions', {
      'quiz_id': id
    })
    .then(resp => {
      setQuestions(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  return(
    <div>
    <NavigationBar/>
    {quiz != null && accountAssignment != null && 
      <div className="quiz-editor">
        <h2>{quiz.quiz_name}</h2>
        <p>Current best score: {accountAssignment.score} / {quiz.marks}</p>
      </div>}
    {quiz == null && <p>Some how quiz is null</p>}
    <p>This should be the place where answers are shown if it is supposed to</p>
    {accountAssignment != null && accountAssignment.show_answer && 
    questions.map((question) => {
      <AnswerDisplay questionId = {question.id}/>
    })}
    
    <button>Return to quiz list</button>
    </div>
  )
}

export { QuizResultPage }