import React from 'react'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'
import {AwardList} from '../quizPage/AwardList'
import {QuizList} from './QuizList'

/*To access questions in the database
*/
const QuizBankPage = () => {
  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then()
  .catch(window.location.href = '/')

  return(
    <div className='quiz-bank-page'>
      <NavigationBar/>
      <div className='page-container'>
        <AwardList/>
        <QuizList/>
      </div>
    </div>
  )
}

export { QuizBankPage }