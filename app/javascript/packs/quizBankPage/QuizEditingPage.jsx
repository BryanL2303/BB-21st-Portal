import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'
import {SelectedQuestion} from './SelectedQuestion'

/*To view existing quiz and edit them
*/
const QuizEditingPage = () => {
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
  }, [])

  //Sends the information from the form to the backend to try and edit a quiz
  //If the form is not fully filled returns an alert to the user
  // function submitForm(e) {
  //   e.preventDefault()
  //   let quizName = ""
  //   let existingQuestions = []
  //   let newQuestions = []
  //   let i = 1
  //   if (e.target[0].value == "") {
  //     alert("Please fill in a name for the quiz")
  //     i = 999
  //   } else {
  //     quizName = e.target[0].value
  //   }
  //   while(e.target[i] != null) {
  //     if (e.target[i].value == '') {
  //       alert("Please fill in all fields before submission")
  //       i = 999 
  //     }
  //     else if (e.target[i + 1].value == "Question bank") {
  //       existingQuestions.push(e.target[i + 3].id)
  //       let counter = 2
  //       while (e.target[i + counter] != null && e.target[i + counter].className != "create-quiz-question__type") {
  //         counter += 1;
  //       }
  //       i = i + counter;
  //     } else if (e.target[i + 1].value == "Create new question") {
  //       let indicator = i + 2
  //       let type = e.target[i].value
  //       let question = e.target[indicator].value
  //       let mark = e.target[indicator + 1].value
  //       let answer = []
  //       if (question != '' && mark != '') {
  //         if (type == "Open-ended") {
  //           answer = e.target[indicator + 2].value
  //           let counter = indicator + 3
  //           while (e.target[i + counter] != null && e.target[i + counter].className != "create-quiz-question__type") {
  //             counter += 1;
  //           }
  //           i = i + counter;
  //         } else {
  //           //Need to check which type of question it is and then subsequently check all fields thereafter
  //           indicator = indicator + 2
  //           while(e.target[indicator] != null) {
  //             if (e.target[indicator].value != "") {
  //               if (e.target[indicator + 1].value == "") {
  //                 alert("Please fill in all fields before submission")
  //                 i = 999
  //                 indicator = 999
  //               } else {
  //                 answer.push({'correct': e.target[indicator].checked, 'option': e.target[indicator + 1].value})
  //               }
  //             }
  //             indicator += 2
  //           }
  //           let counter = indicator
  //           while (e.target[counter] != null && e.target[counter].className != "create-quiz-question__type") {
  //             counter += 1;
  //           }
  //           i = counter;
  //         }
  //       } else {
  //         alert("Please fill in all fields before submission")
  //         i = 999
  //       }
  //       newQuestions.push({"question_type": type, "question": question, "marks": mark, "answer": answer})
  //     }
  //   }
  //   axios.post('/api/quiz/0/create_quiz', {
  //     quiz_name: quizName,
  //     marks: marks,
  //     award: award,
  //     existing_questions: existingQuestions,
  //     new_questions: newQuestions
  //   }, {
  //     withCredentials: true  // Include credentials (cookies)
  //   })
  //   .then(resp => {
  //     //Reset all the input fields
  //   })
  //   .catch(error => {console.log(error)})
  // }

  function quizAssignmentPage(e) {
    e.preventDefault()
    window.location.href = 'assignment/' + quiz.id
  }

  function quizBankPage(e) {
    e.preventDefault()
    window.location.href = '/quiz_bank'
  }

  function deleteQuiz(e) {
    e.preventDefault()
    axios.post('/api/quiz/' + quiz.id + '/delete_quiz', {
      'id': quiz.id
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(window.location.href = '/quiz_bank')
    .catch(error => {console.log(error)})
  }

  return(
    <div className='quiz-editing-page'>
      <NavigationBar/>
      <div className='page-container'>
        {quiz != null && <div className="quiz-editor">
          <h2>{quiz.quiz_name}</h2>
          <p>Total marks: {quiz.marks}</p>
        </div>}
        {quiz == null && <p>Some how quiz is null</p>}
        {questions.map((question) => {
          return(
            <div key={question.id + "-editor"} className="question-editor">
              <SelectedQuestion questionId={question.id} setQuestionId={() => {}} marks={-100} setMarks={() => {}}/>
            </div>
          )
        })}
        <button onClick={quizAssignmentPage}>Assign quiz to Boys</button>
        {quiz != null && quiz.assigned == false && <button onClick={deleteQuiz}>Delete Quiz</button>}
        <button onClick={quizBankPage}>Return to Quiz Bank</button>
      </div>
    </div>
  )
}

export { QuizEditingPage }