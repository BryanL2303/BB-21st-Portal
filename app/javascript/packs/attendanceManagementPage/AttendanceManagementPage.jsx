import React, { useState, useEffect } from 'react'
import axios from 'axios'
import useCookies from '../general/useCookies'
import { NavigationBar } from '../general/NavigationBar'
import { handleServerError } from '../general/handleServerError'
import { ParadeList } from './ParadeList'
import { NewParadeForm } from './NewParadeForm'
import { ParadeInformation } from './ParadeInformation'

// To access attendance records and take new attendance
const AttendanceManagementPage = () => {
  const cookies = useCookies()
  const [pageState, setPageState] = useState('list')
  const [renderPage, setRenderPage] = useState(false)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    //If there is no ongoing session go back to log in page
    axios.post("/application/0/check_session", {},
    {withCredentials: true})
    .then(() => setRenderPage(true))
    .catch(() => window.location.href = '/')
  }, [])

  if (!renderPage) return null

  return(
    <div className='attendance-management-page'>
      <NavigationBar/>
      <div className='page-container'>
        {/* <div className='annual-attendance-list'>
          <h1>Download Attendance File</h1>
          <div className='year-button'>
            <label>2024: </label>
            <button>download pdf</button>
            <button>download excel</button>
          </div>
        </div>
        <br/> */}
        <ParadeList reload={reload} setPageState={setPageState}/>
        <div className='main-block'>
          {pageState == 'form' && <NewParadeForm setReload={setReload}/>}
          {pageState != 'list' && pageState != 'form' && <ParadeInformation id={pageState} setPageState={setPageState} reload={reload} setReload={setReload}/>}
        </div>
      </div>
    </div>
  )
}

export { AttendanceManagementPage }