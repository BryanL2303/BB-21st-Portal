import React, { useState, useContext } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'
import {AwardList} from './AwardList'
import {QuizList} from './QuizList'

/*To access quizes and create new ones
*/
const QuizListPage = () => {
  const cookies = new Cookies()

  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
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