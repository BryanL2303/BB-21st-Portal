import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'
import { handleServerError } from '../general/handleServerError'

/*To facilitate uniform inspection by officers / primers
*/
const UniformInspectionForm = () => {
  const [boyAccounts, setBoyAccounts] = useState([]);
  const [boys, setBoys] = useState([]);
  const [components, setComponents] = useState([]);
  const [componentFields, setComponentFields] = useState({})
  const [selectedContents, setSelectedContents] = useState({});
  const [currentForm, setCurrentForm] = useState();

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then()
  .catch(() => {window.location.href = '/'})

  useEffect(() => {
    axios.post('/api/uniform_inspection/0/get_component_fields', {}, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setComponents(resp.data['components'])
      setComponentFields(resp.data)
    })
    .catch(error => {console.log(error)})
    axios.post('/api/account/0/get_accounts_by_type', {
      'account_type': 'Boy'
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setBoyAccounts(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
  }, [])

  function selectBoy() {
    let boyAccountSelector = document.getElementsByClassName('boy-account-selector')
    let accounts = []
    for (let account of boyAccountSelector) {
      if (account.checked) {
        accounts.push(account.id)
        if (selectedContents[account.id] == undefined) {
          let data = {}
          for (let component of components) {
            data[component.id] = {}
            for (let field of componentFields[component.component_name]) {
              data[component.id][field.id] = false
            }
          }
          selectedContents[account.id] = data
          setSelectedContents(selectedContents)
        }
      }
    }
    axios.post('/api/account/0/get_accounts_by_ids', {
      'boy_ids': accounts
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setBoys(resp.data)
      setCurrentForm(resp.data[0].id)
      for (let component in components) {
        let fieldSelector = document.getElementsByClassName(component + '-field-selector')
        for (let field of fieldSelector) {
          field.checked = selectedContents[resp.data[0].id][component][field.id]
        }
      }
    })
    .catch(resp => handleServerError(resp.response.status))
  }

  function selectField(e) {
    let fieldSelector = document.getElementsByClassName(e.target.name + '-field-selector')
    let data = {}
    for (let field of fieldSelector) {      
      if (field.checked) {
        data[field.id] = true
      } 
      else {
        data[field.id] = false
      }
    }
    selectedContents[currentForm][e.target.name] = data
    setSelectedContents(selectedContents)
  }

  function setForm(e) {
    setCurrentForm(e.target.value)
    for (let component in components) {
      let fieldSelector = document.getElementsByClassName(components[component].id + '-field-selector')
      for (let field of fieldSelector) {
        field.checked = selectedContents[e.target.value][components[component].id][field.id]
      }
    }
  }

  function submitInspection(e) {
    e.preventDefault()
    let data = {}
    let date = new Date();
    const formattedDate = date.toLocaleDateString('en-GB');
    boys.map((boy) => {
      data[boy.id] = (selectedContents[boy.id])
    })
    axios.post('/api/uniform_inspection/0/create_uniform_inspection', {
      'selectedContents': data,
      'date': formattedDate,
      'boys': boys
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(() => {
      window.location.href = '/uniform_inspection_results'
    })
    .catch(resp => handleServerError(resp.response.status))
  }

  return(
    <div className='uniform-inspection-form'>
      <NavigationBar/>
      <div className='header'>
        <label>Currently Inspecting: </label>
        <select onChange={e => setForm(e)} defaultValue={null}>
          {boys.map((boy) => {
            return(
              <option key={boy.id} value={boy.id}>{boy.rank} {boy.account_name}</option>
            )
          })}
        </select>
      </div>
      <div className='page-container'>
        <h2>Uniform Inspection</h2>
        <br/>
        <label>Pick the boys to inspect: </label>
        {boyAccounts.map((boyAccount) => {
          return(
            <div key={boyAccount.id + "-checkbox"} className='account-display'>
              <input type='checkbox' className='boy-account-selector' id={boyAccount.id} onChange={selectBoy}></input>
              <label> Sec {boyAccount.level} {boyAccount.rank} {boyAccount.account_name}</label>
            </div>
          )
        })}
        <br/>
        <form onSubmit={submitInspection}>
          {currentForm != null && components.map((component) => {
            return(
              <div key={component.id}>
                <h3>{component.component_name}</h3>
                {componentFields[component.component_name].map((field) => {
                  return(
                    <div key={field.id}>
                      <input type='checkbox' className={component.id + '-field-selector'} id={field.id} name={component.id} onChange={selectField} defaultChecked={selectedContents[currentForm][component.id][field.id]}></input>
                      <label>{field.description}</label>
                    </div>
                  )
                })}
                <br/>
              </div>
            )
          })}
          <br/>
          <button>Submit Inspection</button>
        </form>
      </div>
    </div>
  )
}

export { UniformInspectionForm }