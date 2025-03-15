import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ManualResultPage } from './ManualResultPage'
import { handleServerError } from '../general/handleServerError'

// To manually create 32A results
const ResultGenerationPage = () => {
  const [awards, setAwards] = useState([])
  const [masteries, setMasteries] = useState([])
  const [award, setAward] = useState();
  const [mastery, setMastery] = useState();
  const [boyAccounts, setBoyAccounts] = useState([])
  const [primerAccounts, setPrimerAccounts] = useState([])
  const [officerAccounts, setOfficerAccounts] = useState([])
  const [pdf, setPdf] = useState(false)
  const [instructorId, setInstructorId] = useState()
  const [boys, setBoys] = useState([])
  const [columns, setColumns] = useState([])
  const [customDescription, setCustomDescription] = useState()
  const [columnContents, setColumnContents] = useState({})

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {},
  { withCredentials: true })
  .then(response => {
    if (response.data.user?.account_type == "Boy" && response.data.user?.appointment == null) window.location.href = '/home'
  })
  .catch(() => {window.location.href = '/'})

  useEffect(() => {
    //make axios call and set awards and accounts
    axios.post('/api/award/0/get_awards', {},
    { withCredentials: true })
    .then(resp => {
      setAwards(resp.data['awards'])
      setMasteries(resp.data['masteries'])
      setAward(resp.data['awards'][0])
    })
    .catch(resp => handleServerError(resp.response.status))
    axios.post('/api/account/0/get_accounts_by_type',
    {'account_type': 'Boy'},
    {withCredentials: true})
    .then(resp => {setBoyAccounts(resp.data)})
    .catch(resp => handleServerError(resp.response.status))
    axios.post('/api/account/0/get_accounts_by_type',
    {'account_type': 'Primer'},
    {withCredentials: true})
    .then(resp => {
      setPrimerAccounts(resp.data)
      let blank = true
      if (resp.data.length > 0) {
        setInstructorId(resp.data[0].id)
        blank = false
      }
      axios.post('/api/account/0/get_accounts_by_type',
      {'account_type': 'Officer'},
      {withCredentials: true})
      .then(resp => {
        setOfficerAccounts(resp.data)
        if (blank == true) setInstructorId(resp.data[0].id)
      })
      .catch(() => setOfficerAccounts([]))
    })
    .catch(resp => handleServerError(resp.response.status))
  }, [])

  function selectAward(e) {
    let data = e.target.value.split(" ")
    setCustomDescription()
    setColumnContents({})
    //make axios call and set states
    axios.post('/api/award/' + data[0] + '/get_award',
    {'id': data[0]},
    {withCredentials: true})
    .then(resp => {
      setAward(resp.data)
      setCustomDescription(resp.data.results_description)
      if (resp.data.has_mastery) {
        axios.post('/api/award/' + data[0] + '/get_masteries',
        {'award_id': data[0]},
        {withCredentials: true})
        .then(resp => {
          setMastery(resp.data[parseInt(data[1]) - 1])
          let descriptionBoxes = document.getElementsByClassName('result-description')
          for (let descriptionBox of descriptionBoxes) {
            descriptionBox.value = resp.data[parseInt(data[1]) - 1].results_description
          }
          setCustomDescription(resp.data[parseInt(data[1]) - 1].results_description)
          axios.post('/api/mastery/' + resp.data[parseInt(data[1]) - 1].id + '/get_columns',
          {'id': resp.data[parseInt(data[1]) - 1].id},
          {withCredentials: true})
          .then(resp => setColumns(resp.data))
          .catch(resp => handleServerError(resp.response.status))
        })
        .catch(resp => handleServerError(resp.response.status))
      }
      else {
        // Potential issue here where award does not have custom description and/or columns
        setMastery()
        let descriptionBox = document.getElementsByClassName('result-description')
        descriptionBox.map((descriptionBox) => {
          descriptionBox.value = resp.data.results_description
        })
        axios.post('/api/award/' + resp.data.id + '/get_columns',
        {'id': resp.data.id},
        {withCredentials: true})
        .then(resp => setColumns(resp.data))
        .catch(resp => handleServerError(resp.response.status))
      }
    })
    .catch(resp => handleServerError(resp.response.status))
  }

  function selectInstructor(e) {
    setInstructorId(e.target.value)
  }

  function selectBoy() {
    let boyAccountSelector = document.getElementsByClassName('boy-account-selector')
    let accounts = []
    for (let account of boyAccountSelector) {
      if (account.checked) accounts.push(account.id)
    }
    axios.post('/api/account/0/get_accounts_by_ids',
    {'boy_ids': accounts},
    {withCredentials: true})
    .then(resp => {
      setBoys(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
  }

  function updateCustomDescription(e) {
    e.preventDefault()
    setCustomDescription(e.target.value)
  }

  //Sends the information from the form to the backend to create assignment
  //If the form is not fully filled returns an alert to the user
  function generateResult(e) {
    e.preventDefault()
    // Check for any  invalid inputs and warns users
    if (instructorId == null) {
      alert("Results cannot be generated without any Primers or Officers.")
    }
    else {
      let i = 1
      let data = {}
      columns.map((column) => {
        data[column.column_title] = []
      })
      // edit the form such that when a new award is selected reset the entire form
      boys.map(() => {
        columns.map((column) => {
          if (e.target[i] != null && e.target[i].value != '') data[column.column_title].push(e.target[i].value)
          i += 1
        })
      })
      setColumnContents(data)
      setPdf(true)
    }
  }

  function undoPdf(e) {
    e.preventDefault()
    setPdf(false)
  }

  return (
    <div className='result-generation-page'>
      <div className='page-container'>
        <div className='main-block'>
          <div className='fields generate-results-form'>
            <h1>Generate Results</h1>
            
            <label htmlFor='results-badge'>Select a badge to view results:</label>
            <select onChange={selectAward} id='results-badge'>
              {awards.map((award, index) => {
                if (!award.has_mastery && award.has_results)
                  return (<option key={award.id + "-award"} value={String(award.id) + ' 0'}>{award.badge_name}</option>)
                else {
                  let array = []
                  masteries[index].map((mastery, index) => {
                    if (mastery.has_results) 
                      array.push(<option key={`${award.id}-mastery-${index + 1}`} value={String(award.id) + ' ' + String(index + 1)}>{award.badge_name} {mastery.mastery_name}</option>)
                  })
                  return(array)
                }
              })}            
            </select>
            
            <label htmlFor="results-instructor">Select the instructor for the badgework:</label>
            <select onChange={selectInstructor} id='results-instructor'>
              {primerAccounts.map((primerAccount) => {
                return (<option key={primerAccount.id + "-primer-instructor"} value={primerAccount.id}>{primerAccount.rank} {primerAccount.account_name}</option>)
              })}
              {officerAccounts.map((officerAccount) => {
                return (<option key={officerAccount.id + "-officer-instructor"} value={officerAccount.id}>{officerAccount.rank} {officerAccount.account_name}</option>)
              })}
            </select>
            
            <p>Select the Boys to include in the results:</p>
            <div className='boy-accounts'>
              {boyAccounts.map((boyAccount) => {
                return(
                  <div key={boyAccount.id + "-display"} className='account-display'>
                    <input type='checkbox' className='boy-account-selector' id={boyAccount.id} onChange={selectBoy}></input>
                    <label htmlFor={boyAccount.id}><span>Sec {boyAccount.level} {boyAccount.rank} {boyAccount.account_name}</span></label>
                  </div>
                )
              })}
            </div>
          </div>
          <form className='fields' onSubmit={generateResult}>
            {award != null && mastery == null && award.custom_description && <div>
              <br/>
              <label>Description of badgework:</label>
              <br/>
              <label>{award.description_cue}</label>
              <br/>
              <textarea className='result-description' onBlur={updateCustomDescription} defaultValue={award.results_description}></textarea>
              <br/>
            </div>}
            {award != null && mastery == null && award.has_custom_columns && <div>
              <label>Fields of custom columns:</label>
              <br/>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    {columns.map((column) =>{
                      return (<th key={column.id + "-column"}>{column.column_title}</th>)
                    })}
                  </tr>
                </thead>
                <tbody>
                  {boys.map((boy) => {
                    return(
                      <tr key={boy.id + "-row"}>
                        <th>Sec {boy.level} {boy.rank} {boy.account_name}</th>
                        {columns.map((column) =>{
                          return(
                            <th key={column.id + "-row-column"}><input id={column.column_title}></input></th>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>}
            {award != null && mastery != null && mastery.custom_description && <div>
              <br/>
              <label>Description of badgework:</label>
              <br/>
              <label>{mastery.description_cue}</label>
              <br/>
              <textarea className='result-description' onBlur={updateCustomDescription} defaultValue={mastery.results_description}></textarea>
              <br/>
            </div>}
            {award != null && mastery != null && mastery.has_custom_columns && <div>
              <label>Fields of custom columns:</label>
              <br/>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    {columns.map((column) =>{
                      return (<th key={column.id + "-column"}>{column.column_title}</th>)
                    })}
                  </tr>
                </thead>
                <tbody>
                  {boys.map((boy) => {
                    return(
                      <tr key={boy.id + "-row"}>
                        <th>Sec {boy.level} {boy.rank} {boy.account_name}</th>
                        {columns.map((column) =>{
                          return (<th key={column.id + "-row-column"}><input id={column.column_title}></input></th>)
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
        {pdf && <button onClick={undoPdf}>Hide Results</button>}
        </div>
      </div>
    </div>
  )
}

export { ResultGenerationPage }