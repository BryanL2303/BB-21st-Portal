import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Layout';
import { HomePage } from './homePage/HomePage'
import { LogInPage } from './logInPage/LogInPage'
import { AttendanceManagementPage } from './attendanceManagementPage/AttendanceManagementPage'
import { AwardsManagementPage } from './awardsManagementPage/AwardsManagementPage'
import { ResultPage } from './resultPage/ResultPage'
import { ResultGenerationPage } from './resultPage/ResultGenerationPage'
import { AdminPage } from './adminPage/AdminPage'
import { UserManagementPage } from './userManagementPage/UserManagementPage'
import { ResetPasswordPage } from './userManagementPage/ResetPasswordPage'

const container = document.body.appendChild(document.createElement('div'));
const root = createRoot(container);
root.render(
  <Router>
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/log_in' element={<LogInPage/>}/>
        <Route path='/admin' element={<AdminPage/>}/>
        {/* <Route path='/' element={<LogInPage/>}/> */}
        <Route path='/home' element={<UserManagementPage/>}/>
        <Route path='/attendance_management' element={<AttendanceManagementPage/>}/>
        <Route path='/awards' element={<AwardsManagementPage/>}/>
        <Route path='/generate_result' element={<ResultGenerationPage/>}/>
        <Route path='/view_result/:id' element={<ResultPage/>}/>
        <Route path='/user_management' element={<UserManagementPage/>}/>
        <Route path='/reset_password' element={<ResetPasswordPage/>}/>
      </Route>
    </Routes>
  </Router>
);
