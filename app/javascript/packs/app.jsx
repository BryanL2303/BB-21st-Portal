import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {AwardProvider} from './context/AwardContext'
import { LogInPage } from './logInPage/LogInPage'
import { AwardsManagementPage } from './awardsManagementPage/AwardsManagementPage'
import { QuizListPage } from './quizPage/QuizListPage'
import { QuizPage } from './quizPage/QuizPage'
import { QuizResultPage } from './quizPage/QuizResultPage'
import { QuestionBankPage } from './questionBankPage/QuestionBankPage'
import { QuizBankPage } from './quizBankPage/QuizBankPage'
import { QuizCreationPage } from './quizBankPage/QuizCreationPage'
import { QuizEditingPage } from './quizBankPage/QuizEditingPage'
import { QuizAssignmentPage } from './quizAssignmentPage/QuizAssignmentPage'
import { AssignmentPage } from './assignmentPage/AssignmentPage'
import { ResultPage } from './resultPage/ResultPage'
import { ResultGenerationPage } from './resultPage/ResultGenerationPage'
import { AwardCertificationPage } from './awardCertificationPage/AwardCertificationPage'
import { AdminPage } from './adminPage/AdminPage'
import { UserManagementPage } from './userManagementPage/UserManagementPage'

const container = document.body.appendChild(document.createElement('div'));
const root = createRoot(container);
root.render(
  <AwardProvider>
    <Router>
      <Routes>
        <Route path='/admin' element={<AdminPage/>}/>
        <Route path='/' element={<LogInPage/>}/>
        <Route path='/quiz' element={<QuizListPage/>}/>
        <Route path='/home' element={<QuizListPage/>}/>
        <Route path='/awards' element={<AwardsManagementPage/>}/>
        <Route path='/generate_result' element={<ResultGenerationPage/>}/>
        <Route path='/quiz/:id' element={<QuizPage/>}/>
        <Route path='/quiz_result/:id' element={<QuizResultPage/>}/>
        <Route path='/question_bank' element={<QuestionBankPage/>}/>
        <Route path='/quiz_bank' element={<QuizBankPage/>}/>
        <Route path='/quiz_creation' element={<QuizCreationPage/>}/>
        <Route path='/view_quiz/:id' element={<QuizEditingPage/>}/>
        <Route path='/view_quiz/assignment/:id' element={<QuizAssignmentPage/>}/>
        <Route path='/view_assignment/:id' element={<AssignmentPage/>}/>
        <Route path='/view_result/:id' element={<ResultPage/>}/>
        <Route path='/view_award_certification/:id' element={<AwardCertificationPage/>}/>
        <Route path='/user_management' element={<UserManagementPage/>}/>
      </Routes>
    </Router>
  </AwardProvider>);