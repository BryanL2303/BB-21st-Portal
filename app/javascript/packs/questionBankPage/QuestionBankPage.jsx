import React, { useState, useContext } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'
import {AwardList} from '../quizPage/AwardList'
import {QuestionList} from './QuestionList'

/*To access questions in the database
*/
const QuestionBankPage = () => {
  const cookies = new Cookies()

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then(resp => {})
  .catch(resp => {
    window.location.href = '/'
  })

  //Show the form to create new accounts
  function showForm () {
    setPageState("form");
  }

  return(
    <div className='question-bank-page'>
      <NavigationBar/>
      <div className='page-container'>
        <AwardList/>
        <QuestionList/>
      </div>
    </div>
  )
}

export { QuestionBankPage }