import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { NavigationBar } from '../general/NavigationBar'
import { HandleDownloadWithExcelJS } from './AnnualAttendanceExcel'
import { ParadeList } from './ParadeList'
import { NewParadeForm } from './NewParadeForm'
import { ParadeInformation } from './ParadeInformation'

// To access attendance records and take new attendance
const AttendanceManagementPage = () => {
  const [pageState, setPageState] = useState('list')
  const [renderPage, setRenderPage] = useState(false)
  const [reload, setReload] = useState(false)
  const [years, setYears] = useState([])

  useEffect(() => {
    //If there is no ongoing session go back to log in page
    axios.post("/application/0/check_session", {},
    {withCredentials: true})
    .then(() => setRenderPage(true))
    .catch(() => window.location.href = '/')
    setYears((prev) => {
      const currentYear = new Date().getFullYear();
      let next = [...prev];
      for (let year = 2025; year <= currentYear; year++) {
        next.push(year);
      }
      return next
    })
  }, [])

  if (!renderPage) return null

  return(
    <div className='attendance-management-page'>
      <NavigationBar/>
      <div className='page-container'>
        <div className='annual-attendance-list'>
          <h1>Yearly Attendance File</h1>
          {years.map((year) => {
            return(<HandleDownloadWithExcelJS key={year} year={year}/>)
          })}
        </div>
        <br/>
        <ParadeList reload={reload} setPageState={setPageState}/>
        <div className='main-block'>
          {pageState == 'form' && <NewParadeForm setReload={setReload}/>}
          {pageState != 'list' && pageState != 'form' && !(pageState.includes('Y')) && <ParadeInformation id={pageState} setPageState={setPageState} reload={reload} setReload={setReload}/>}
        </div>
      </div>
    </div>
  )
}

export { AttendanceManagementPage }