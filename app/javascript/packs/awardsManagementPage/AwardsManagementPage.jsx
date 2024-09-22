import React, { useEffect, useState, useContext } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { NavigationBar } from '../general/NavigationBar'
import { AwardTracker } from './AwardTracker'
import { AwardInformation } from './AwardInformation'
import { AwardEditor } from './AwardEditor'

/*To access current users and create new accounts
*/
const AwardsManagementPage = () => {
  const cookies = new Cookies()
  const [pageState, setPageState] = useState("tracker");
  const [awards, setAwards] = useState([])

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then(resp => {})
  .catch(resp => {
    window.location.href = '/'
  })

  useEffect(() => {
    axios.post('/api/award/0/get_awards', {
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setAwards(resp.data['awards'])
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  function showTracker(e) {
    e.preventDefault()
    setPageState('tracker')
  }

  function showAward(e) {
    e.preventDefault()
    setPageState(e.target.className)
  }

  return(
    <div className='award-management-page'>
      <NavigationBar/>
      <div className='page-container'>
        <div className='awards-list'>
          <button onClick={showTracker}>Awards Tracker</button>
          <p>Current Awards</p>
          {awards.map((award) => {
            return(
              <button onClick={showAward} className={award.id}>{award.badge_name}</button>
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