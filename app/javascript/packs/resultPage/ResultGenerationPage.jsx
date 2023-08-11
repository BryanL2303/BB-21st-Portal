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
  const [masteries, setMasteries] = useState([])
  const [award, setAward] = useState();
  const [mastery, setMastery] = useState();
  const [masteryLevel, setMasteryLevel] = useState()
  const [boyAccounts, setBoyAccounts] = useState([])
  const [primerAccounts, setPrimerAccounts] = useState([])
  const [officerAccounts, setOfficerAccounts] = useState([])
  const [pdf, setPdf] = useState(false)
  const [awardId, setAwardId] = useState()
  const [instructorId, setInstructorId] = useState()
  const [boys, setBoys] = useState([])
  const [columns, setColumns] = useState([])
  const [limiter, setLimiter] = useState(false)
  const [customDescription, setCustomDescription] = useState()
  const [columnContents, setColumnContents] = useState({})

  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
  }

  useEffect(() => {
    //make axios call and set awards and accounts
    axios.post('/api/award/0/get_awards', {
    })
    .then(resp => {
      setAwards(resp.data['awards'])
      setMasteries(resp.data['masteries'])
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

  function selectAward(e) {
    setAwardId(e.target.id)
    setMasteryLevel(e.target.className)
    setCustomDescription()
    setColumnContents({})
    //make axios call and set states
    axios.post('/api/award/' + e.target.id + '/get_award', {
      'id': e.target.id
    })
    .then(resp => {
      setAward(resp.data)
      if (resp.data.has_mastery) {
        axios.post('/api/award/' + e.target.id + '/get_masteries', {
          'award_id': e.target.id
        })
        .then(resp => {
          setMastery(resp.data[parseInt(e.target.className) - 1])
          axios.post('/api/mastery/' + resp.data[parseInt(e.target.className) - 1].id + '/get_columns', {
            'id': resp.data[parseInt(e.target.className) - 1].id
          })
          .then(resp => {
            setColumns(resp.data)
          })
          .catch(resp => console.log(resp.response.statusText))
        })
        .catch(resp => errorMessage(resp.response.statusText))
      }
      else {
        setMastery()
        axios.post('/api/award/' + resp.data.id + '/get_columns', {
          'id': resp.data.id
        })
        .then(resp => {
          setColumns(resp.data)
        })
        .catch(resp => console.log(resp.response.statusText))
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function selectInstructor(e) {
    setInstructorId(e.target.id)
  }

  function selectBoy(e) {
    let boyAccountSelector = document.getElementsByClassName('boy-account-selector')
    let accounts = []
    for (let account of boyAccountSelector) {
      if (account.checked) {
        accounts.push(account.id)
      }
    }
    axios.post('/api/account/0/get_accounts_by_ids', {
      'boy_ids': accounts
    })
    .then(resp => {
      setBoys(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function updateCustomDescription(e) {
    e.preventDefault()
    setCustomDescription(e.target.value)
  }

  //Sends the information from the form to the backend to create assignment
  //If the form is not fully filled returns an alert to the user
  function generateResult(e) {
    e.preventDefault()
    let i = 1
    let data = {}
    columns.map((column) => {
      data[column.column_title] = []
    })
    while(e.target[i] != null) {
      columns.map((column) => {
        if (e.target[i] != null && e.target[i].value != '') {
          data[column.column_title].push(e.target[i].value)
        }
        i += 1
      })
    }
    setColumnContents(data)

    document.getElementsByClassName('fields')[0].hidden = true
    document.getElementsByClassName('fields')[1].hidden = true

    setPdf(true)
  }

  function undoPdf(e) {
    e.preventDefault()
    setPdf(false)
    document.getElementsByClassName('fields')[0].hidden = false
    document.getElementsByClassName('fields')[1].hidden = false
  }

  return(
    <div className='result-generation-page'>
      <NavigationBar/>
      <div className='page-container'>
        <div className='main-block'>
          <div className='fields'>
          <h1>Generate Results</h1>
          <br/>
          <p>Pick the badge to generate results for</p>
          {awards.map((award, index) => {
            if (!award.has_mastery && award.has_results) {
              return(
                <div>
                  <input type='radio' id={award.id} className='0' onChange={selectAward} name='award'></input>
                  <label> {award.badge_name}</label>
                </div>
              )
            } else {
              return (
                <div>
                  {masteries[index].map((mastery, index) => {
                    if (mastery.has_results) {
                      return (
                        <div>
                          <input type='radio' id={award.id} className={index + 1} onChange={selectAward} name='award'></input>
                          <label> {award.badge_name} {mastery.mastery_name}</label>
                          <br/>
                        </div>
                      )
                    }
                  })}
                </div>
              )
            }
          })}
          <br/>
          <p>Pick the instructor for the badgework</p>
          {primerAccounts.map((primerAccount) => {
            return(
              <div className='account-display'>
                <input type='radio' name='instructor' id={primerAccount.id} onChange={selectInstructor}></input>
                <label> {primerAccount.rank} {primerAccount.account_name}</label>
              </div>
            )
          })}
          {officerAccounts.map((officerAccount) => {
            return(
              <div className='account-display'>
                <input type='radio' name='instructor' id={officerAccount.id} onChange={selectInstructor}></input>
                <label> {officerAccount.rank} {officerAccount.account_name}</label>
              </div>
            )
          })}
          <br/>
          <p>Pick the Boys to include in the results</p>
          {boyAccounts.map((boyAccount) => {
            return(
              <div className='account-display'>
                <input type='checkbox' className='boy-account-selector' id={boyAccount.id} onChange={selectBoy}></input>
                <label> Sec {boyAccount.level} {boyAccount.rank} {boyAccount.account_name}</label>
              </div>
            )
          })}
          <br/>
          </div>
          <form className='fields' onSubmit={generateResult}>
            {award != null && mastery == null && award.custom_description && <div>
              <br/>
              <label>Description of badgework:</label>
              <br/>
              <textarea defaultValue='THIS IS FOR CUSTOM DESCRIPTIONS'></textarea>
              <br/>
              <label>Fields of custom columns:</label>
              <br/>
              <textarea defaultValue='THIS IS FOR CUSTOM COLUMNS'></textarea>
            </div>}
            {award != null && mastery != null && mastery.custom_description && <div>
              <br/>
              <label>Description of badgework:</label>
              <br/>
              <textarea onBlur={updateCustomDescription} defaultValue='THIS IS FOR CUSTOM DESCRIPTIONS'></textarea>
              <br/>
              <label>Fields of custom columns:</label>
              <br/>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    {columns.map((column) =>{
                      return(
                        <th>{column.column_title}</th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {boys.map((boy) => {
                    return(
                      <tr>
                        <th>Sec {boy.level} {boy.rank} {boy.account_name}</th>
                        {columns.map((column) =>{
                          return(
                            <th><input id={column.column_title}></input></th>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>}
            <button>Generate Results</button>
          </form>
        {pdf && <ManualResultPage award={award} mastery={mastery} instructorId={instructorId} boys={boys} customDescription={customDescription} columns={columns} columnContents={columnContents}/>}
        {pdf && <button onClick={undoPdf}>Change fields</button>}
        </div>
      </div>
    </div>
  )
}

export { ResultGenerationPage }