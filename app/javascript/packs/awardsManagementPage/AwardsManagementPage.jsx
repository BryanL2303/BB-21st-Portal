import React, { useEffect, useState, useContext } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'
import {AwardCreationForm} from './AwardCreationForm'
import {AwardInformation} from './AwardInformation'

/*To access current users and create new accounts
*/
const AwardsManagementPage = () => {
  const cookies = new Cookies()
  const [pageState, setPageState] = useState("form");
  const [awards, setAwards] = useState([])

  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
  }

  useEffect(() => {
    axios.post('/api/award/0/get_awards', {
    })
    .then(resp => {
      setAwards(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  function showAward(e) {
    e.preventDefault()
    setPageState(e.target.className)
  }

  //Show the form to create new accounts
  function showForm () {
    setPageState("form");
  }

  return(
    <div className='award-management-page'>
      <NavigationBar/>
      <div className='page-container'>
        <div className='awards-list'>
          <button onClick = {showForm}>Create New Award</button>
          <p>Current Awards</p>
          {awards.map((award) => {
            return(
              <button onClick={showAward} className={award.id}>{award.badge_name}</button>
            )
          })}
        </div>
        <div className='main-block'>
          {pageState == "form" && <AwardCreationForm/>}
          {pageState != "form" && <AwardInformation awardId={pageState}/>}
        </div>
      </div>
    </div>
  )
}

export { AwardsManagementPage }