import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NavigationBar } from '../general/NavigationBar'
import { AwardTracker } from './AwardTracker'
import { AwardInformation } from './AwardInformation'
import { AwardEditor } from './AwardEditor'
import { handleServerError } from '../general/handleServerError'
import useCookies from '../general/useCookies'

// To access current users and create new accounts
const AwardsManagementPage = () => {
  const cookies = useCookies()
  const [renderPage, setRenderPage] = useState(false)
  const [pageState, setPageState] = useState("tracker");
  const [awards, setAwards] = useState([])

  useEffect(() => {
    //If there is no ongoing session go back to log in page
    axios.post("/application/0/check_session", {},
    { withCredentials: true })
    .then(() => {
      setRenderPage(true)
      axios.post('/api/award/0/get_awards', {},
      { withCredentials: true })
      .then(resp => {setAwards(resp.data['awards'])})
      .catch(resp => handleServerError(resp.response.status))
    })
    .catch(() => {window.location.href = '/'})
  }, [])

  function showTracker(e) {
    e.preventDefault()
    setPageState('tracker')
  }

  function showAward(e) {
    e.preventDefault()
    setPageState(e.target.className)
  }

  if (!renderPage) return null

  return(
    <div className='award-management-page'>
      <NavigationBar/>
      <div className='page-container'>
        <div className='awards-list'>
          <button onClick={showTracker}>Awards Tracker</button>
          <p>Current Awards</p>
          {awards.map((award) => {
            return(
              <button key={award.id} onClick={showAward} className={award.id}>{award.badge_name}</button>
            )
          })}
        </div>
        <div className='main-block'>
          {pageState == "tracker" && <AwardTracker/>}
          {pageState != "tracker" && cookies.get("Type") != 'Admin' && <AwardInformation awardId={pageState}/>}
          {pageState != "tracker" && cookies.get("Type") == 'Admin' && <AwardEditor awardId={pageState}/>}
        </div>
      </div>
    </div>
  )
}

export { AwardsManagementPage }