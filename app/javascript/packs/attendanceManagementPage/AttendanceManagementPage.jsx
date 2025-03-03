import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ParadeList } from './ParadeList'
import { NewParadeForm } from './NewParadeForm'
import { ParadeInformation } from './ParadeInformation'

// To access attendance records and take new attendance
const AttendanceManagementPage = () => {
  const [pageState, setPageState] = useState('form')
  const [renderPage, setRenderPage] = useState(false)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    // If there is no ongoing session go back to log in page
    axios.post("/application/0/check_session", {},
    {withCredentials: true})
    .then(() => setRenderPage(true))
    .catch(() => window.location.href = '/')
  }, [])

  if (!renderPage) return null

  return(
    <div className='attendance-management-page'>
      <div className='page-container'>
        <div className='parades'>
          <ParadeList reload={reload} setPageState={setPageState}/>
          <div className='main-block'>
            {pageState == 'form' && <NewParadeForm setReload={setReload}/>}
            {pageState != 'list' && pageState != 'form' && !(pageState.includes('Y')) && <ParadeInformation id={Number(pageState)} setPageState={setPageState} reload={reload} setReload={setReload}/>}
          </div>
        </div>
      </div>
    </div>
  )
}

export { AttendanceManagementPage }