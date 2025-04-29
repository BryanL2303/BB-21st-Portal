import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Layout';
// import { HomePage } from './homePage/HomePage'
import { LogInPage } from './logInPage/LogInPage'
import { AttendanceManagementPage } from './attendanceManagementPage/AttendanceManagementPage'
import { AwardsManagementPage } from './awardsManagementPage/AwardsManagementPage'
import { ResultPage } from './resultPage/ResultPage'
import { ResultGenerationPage } from './resultPage/ResultGenerationPage'
import { AdminPage } from './adminPage/AdminPage'
import { UniformInspectionPage } from './uniformInspectionPage/UniformInspectionPage'
import { UniformInspectionResultPage } from './uniformInspectionPage/UniformInspectionResultPage'
import { UniformInspectionForm } from './uniformInspectionPage/UniformInspectionForm'
import { UserManagementPage } from './userManagementPage/UserManagementPage'
import { UserManagementSmallPage } from './userManagementPage/UserManagementSmallPage'
import { ResetPasswordPage } from './userManagementPage/ResetPasswordPage'
import { NotFound } from "./general/NotFound";
import { DashboardPage } from "./dashboardPage/dashboardPage";
import { ParadeNoticePage } from './attendanceManagementPage/ParadeNoticePage';
import { UserAwards } from './awardsManagementPage/UserAwards';
import { HelpPage } from './helpPage/HelpPage';
import { HomeEditorPage } from './homePage/HomeEditorPage';
import { UniformInspectionUser } from './uniformInspectionPage/UniformInspectionUser';

const container = document.body.appendChild(document.createElement('div'));
const root = createRoot(container);
root.render(
  <Router>
    <Routes>
      <Route element={<Layout />}>
        {/* Temporarily disable home page since its filled with filler data */}
        <Route path='/' element={<HomePage/>}/>
        <Route path='/log_in' element={<LogInPage/>}/>
        <Route path='/admin' element={<AdminPage/>}/>
        <Route path='/' element={<LogInPage/>}/>
        <Route path='/home' element={<DashboardPage/>}/>
        <Route path='/parade_notice' element={<ParadeNoticePage />}/>
        <Route path='/attendance_management' element={<AttendanceManagementPage/>}/>
        <Route path='/user_awards' element={<UserAwards />}/>
        <Route path='/awards' element={<AwardsManagementPage/>}/>
        <Route path='/generate_result' element={<ResultGenerationPage/>}/>
        <Route path='/view_result/:id' element={<ResultPage/>}/>
        <Route path='/uniform_inspection_results' element={<UniformInspectionPage/>}/>
        <Route path='/view_uniform_inspection/:id' element={<UniformInspectionResultPage/>}/>
        <Route path='/uniform_inspection_form' element={<UniformInspectionForm/>}/>
        <Route path='/user_inspections' element={<UniformInspectionUser/>}/>
        <Route path='/user_management' element={<UserManagementPage/>}/>
        <Route path='/user_management/:userId' element={<UserManagementSmallPage/>}/>
        <Route path='/reset_password' element={<ResetPasswordPage/>}/>
        <Route path='/help' element={<HelpPage />} />
        <Route path='/home_editor' element={<HomeEditorPage />} />

        <Route path="*" element={<NotFound />} /> 
      </Route>
    </Routes>
  </Router>
);
