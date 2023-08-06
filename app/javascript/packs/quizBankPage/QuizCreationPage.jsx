import React, { useState, useContext } from 'react'
import Popup from 'reactjs-popup';
import Cookies from 'universal-cookie'
import axios from 'axios'
import { AwardContext } from '../context/AwardContext'
import {NavigationBar} from '../general/NavigationBar'
import {SetQuestionForm} from './SetQuestionForm'

/*To create new quizzes and add them into the quiz bank
*/
const QuizCreationPage = () => {
  const cookies = new Cookies()
  const [award, setAward] = useContext(AwardContext)
  const [number, setNumber] = useState(1);
  const [quizName, setQuizName] = useState("");
  const [marks, setMarks] = useState(0);
  const [questions, setQuestions] = useState([1]);

  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
  }

  function addQuestion(e) {
    e.preventDefault()
    setNumber(number + 1)
    setQuestions([...questions, 1])
  }

  //Sends the information from the form to the backend to try and create a quiz
  //If the form is not fully filled returns an alert to the user
  function submitForm(e) {
    e.preventDefault()
    let quizName = ""
    let existingQuestions = []
    let newQuestions = []
    let i = 1
    if (e.target[0].value == "") {
      alert("Please fill in a name for the quiz")
      i = 999
    } else {
      quizName = e.target[0].value
    }
    while(e.target[i] != null) {
      if (e.target[i].value == '') {
        alert("Please fill in all fields before submission")
        i = 999 
      }
      else if (e.target[i + 1].value == "Question bank") {
        existingQuestions.push(e.target[i + 2].id)
        let counter = 2
        while (e.target[i + counter] != null && e.target[i + counter].className != "create-quiz-question__type") {
          counter += 1;
        }
        i = i + counter;
      } else if (e.target[i + 1].value == "Create new question") {
        let indicator = i + 2
        let type = e.target[i].value
        let question = e.target[indicator].value
        let mark = e.target[indicator + 1].value
        let answer = []
        if (question != '' && mark != '') {
          if (type == "Open-ended") {
            answer = e.target[indicator + 2].value
            let counter = indicator + 3
            while (e.target[i + counter] != null && e.target[i + counter].className != "create-quiz-question__type") {
              counter += 1;
            }
            i = i + counter;
          } else {
            //Need to check which type of question it is and then subsequently check all fields thereafter
            indicator = indicator + 2
            while(e.target[indicator] != null) {
              if (e.target[indicator].value != "") {
                if (e.target[indicator + 1].value == "") {
                  alert("Please fill in all fields before submission")
                  i = 999
                  indicator = 999
                } else {
                  answer.push({'correct': e.target[indicator].checked, 'option': e.target[indicator + 1].value})
                }
              }
              indicator += 2
            }
            let counter = indicator
            while (e.target[counter] != null && e.target[counter].className != "create-quiz-question__type") {
              counter += 1;
            }
            i = counter;
          }
        } else {
          alert("Please fill in all fields before submission")
          i = 999
        }
        newQuestions.push({"question_type": type, "question": question, "marks": mark, "answer": answer})
      }
    }
    axios.post('/api/quiz/0/create_quiz', {
      quiz_name: quizName,
      marks: marks,
      award: award,
      existing_questions: existingQuestions,
      new_questions: newQuestions
    })
    .then(resp => {
      //Reset all the input fields
      alert("Quiz has been created!")
      window.location.href = '/quiz_bank'
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <div className='quiz-creation-page'>
      <NavigationBar/>
      <div className='page-container'>
        <label>Create a quiz for: {award.awardId}</label>
        <div className="quiz-creation-summary">
          <h2>Summary</h2>
          <p>Number of questions: {number}</p>
          <p>Total marks: {marks}</p>
        </div>
        <form className='create-quiz-form' onSubmit={ submitForm }>
          <input placeholder="Name of the quiz"></input>
          {questions.map((num) => {
            return (
              <SetQuestionForm number={number} setNumber={setNumber} marks={marks} setMarks={setMarks}/>
            )
          })}
          
          <button>Create Quiz</button>
        </form>
        <button onClick={addQuestion}>Add Question</button>
        <button>Save Quiz</button>
      </div>
    </div>
  )
}

export { QuizCreationPage }