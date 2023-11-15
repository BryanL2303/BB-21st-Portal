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
import { AssignmentGradingPage } from './assignmentPage/AssignmentGradingPage'
import { ResultPage } from './resultPage/ResultPage'
import { ResultGenerationPage } from './resultPage/ResultGenerationPage'
import { UniformInspectionPage } from './uniformInspectionPage/UniformInspectionPage'
import { UniformInspectionResultPage } from './uniformInspectionPage/UniformInspectionResultPage'
import { UniformInspectionForm } from './uniformInspectionPage/UniformInspectionForm'
import { AdminPage } from './adminPage/AdminPage'
import { UserManagementPage } from './userManagementPage/UserManagementPage'
import { ResetPasswordPage } from './userManagementPage/ResetPasswordPage'

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
        <Route path='/view_assignment/grade/:id' element={<AssignmentGradingPage/>}/>
        <Route path='/view_result/:id' element={<ResultPage/>}/>
        <Route path='/uniform_inspection_results' element={<UniformInspectionPage/>}/>
        <Route path='/view_uniform_inspection/:id' element={<UniformInspectionResultPage/>}/>
        <Route path='/uniform_inspection_form' element={<UniformInspectionForm/>}/>
        <Route path='/user_management' element={<UserManagementPage/>}/>
        <Route path='/reset_password' element={<ResetPasswordPage/>}/>
      </Routes>
    </Router>
  </AwardProvider>
);