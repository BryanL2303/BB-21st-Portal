import React, { useEffect, useState, useContext } from 'react'
import Popup from 'reactjs-popup';
import { useParams } from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'
import {ManualResultPage} from './ManualResultPage'

/*To manually create 32A results
*/
const ResultGenerationPage = () => {
  const cookies = new Cookies()
  const [awards, setAwards] = useState([])
  const [masteryLevel, setMasteryLevel] = useState()
  const [boyAccounts, setBoyAccounts] = useState([])
  const [primerAccounts, setPrimerAccounts] = useState([])
  const [officerAccounts, setOfficerAccounts] = useState([])
  const [pdf, setPdf] = useState(false)
  const [awardId, setAwardId] = useState()
  const [instructorId, setInstructorId] = useState()
  const [boys, setBoys] = useState([])
  const [limiter, setLimiter] = useState(false)

  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
  }

  useEffect(() => {
    //make axios call and set awards and accounts
    axios.post('/api/award/0/get_awards', {
    })
    .then(resp => {
      setAwards(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
    axios.post('/api/account/0/get_accounts', {
      'account_type': 'Boy'
    })
    .then(resp => {
      setBoyAccounts(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
    axios.post('/api/account/0/get_accounts', {
      'account_type': 'Primer'
    })
    .then(resp => {
      setPrimerAccounts(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
    axios.post('/api/account/0/get_accounts', {
      'account_type': 'Officer'
    })
    .then(resp => {
      setOfficerAccounts(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  function setAward(e) {
    setSelectedAward(e.target.id)
  }

  //Sends the information from the form to the backend to create assignment
  //If the form is not fully filled returns an alert to the user
  function generateResult(e) {
    e.preventDefault()
    let awardRadios = document.getElementsByName('award')
    let instructorRadios = document.getElementsByName('instructor')
    let boyAccountSelector = document.getElementsByClassName('boy-account-selector')
    awardRadios.forEach((award) => {
      if (award.checked) {
        setAwardId(award.id)
        setMasteryLevel(award.className)
      }
    })
    instructorRadios.forEach((instructor) => {
      if (instructor.checked) {
        setInstructorId(instructor.id)
      }
    })
    let accounts = []
    for (let account of boyAccountSelector) {
      if (account.checked) {
        accounts.push(account.id)
      }
    }
    setBoys(accounts)
    setPdf(true)
  }

  function undoPdf(e) {
    e.preventDefault()
    setPdf(false)
  }

  return(
    <div className='result-generation-page'>
      <NavigationBar/>
      <div className='page-container'>
        {!pdf && <form onSubmit={generateResult}>
          <h1>Generate Results</h1>
          <br/>
          <p>Pick the badge to generate results for</p>
          {awards.map((award) => {
            if (!award.has_mastery) {
              return(
                <div>
                  <input type='radio' id={award.id} className='0' name='award'></input>
                  <label> {award.badge_name}</label>
                </div>
              )  
            } else {
              return (
                <div>
                  <input type='radio' id={award.id} className='1' name='award'></input>
                  <label> {award.badge_name} Basic</label>
                  <br/>
                  <input type='radio' id={award.id} className='2' name='award'></input>
                  <label> {award.badge_name} Advanced</label>
                  <br/>
                  <input type='radio' id={award.id} className='3' name='award'></input>
                  <label> {award.badge_name} Master</label>
                </div>
              )
            }
          })}
          <br/>
          <p>Pick the instructor for the badgework</p>
          {primerAccounts.map((primerAccount) => {
            return(
              <div className='account-display'>
                <input type='radio' name='instructor' id={primerAccount.id}></input>
                <label> {primerAccount.rank} {primerAccount.account_name}</label>
              </div>
            )
          })}
          {officerAccounts.map((officerAccount) => {
            return(
              <div className='account-display'>
                <input type='radio' name='instructor' id={officerAccount.id}></input>
                <label> {officerAccount.rank} {officerAccount.account_name}</label>
              </div>
            )
          })}
          <br/>
          <p>Pick the Boys to include in the results</p>
          {boyAccounts.map((boyAccount) => {
            return(
              <div className='account-display'>
                <input type='checkbox' className='boy-account-selector' id={boyAccount.id}></input>
                <label> Sec {boyAccount.level} {boyAccount.rank} {boyAccount.account_name}</label>
              </div>
            )
          })}
          <br/>
          <button>Generate Results</button>
        </form>}
        <br/>
        {pdf && <ManualResultPage awardId={awardId} masteryLevel={masteryLevel} instructorId={instructorId} boyIds={boys}/>}
        {pdf && <button onClick={undoPdf}>Change fields</button>}
      </div>
    </div>
  )
}

export { ResultGenerationPage }