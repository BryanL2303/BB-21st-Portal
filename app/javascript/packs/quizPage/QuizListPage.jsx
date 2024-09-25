import React from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'
import {AwardList} from './AwardList'
import {QuizList} from './QuizList'

/*To access quizes and create new ones
*/
const QuizListPage = () => {
  const cookies = new Cookies()

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then()
  .catch(() => {window.location.href = '/'})

  if (cookies.get('Type') != 'Boy') {
    window.location.href = '/user_management'
  }

  return(
    <div className='quiz-list-page'>
      <NavigationBar/>
      <div className='page-container'>
        <AwardList/>
        <QuizList/>
      </div>
    </div>
  )
}

export { QuizListPage }