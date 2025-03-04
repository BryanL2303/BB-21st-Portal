import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {handleServerError} from '../general/handleServerError'

/*To facilitate uniform inspection by officers / primers
*/
const UniformInspectionResultPage = () => {
  const [components, setComponents] = useState([]);
  const [componentFields, setComponentFields] = useState({})
  const [currentInspection, setCurrentInspection] = useState()
  const [inspections, setInspections] = useState();
  const [allInspections, setAllInspections] = useState();
  const [boys, setBoys] = useState([]);
  const { id } = useParams()

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
      console.log(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
    axios.post('/api/uniform_inspection/' + id + '/get_inspection', {
      'id': id
    })
    .then(resp => {
      setAllInspections(resp.data['inspections'])
      setInspections(resp.data['inspections'][resp.data['boy']['id']])
      setCurrentInspection(resp.data['inspections'][resp.data['boy']['id']][id])
      setBoys(resp.data['boys'])
      console.log(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
  }, [])

  function selectInspection(e) {
    setCurrentInspection(inspections[e.target.value])
  }

  function selectBoy(e) {
    let relevantInspections = allInspections[e.target.value]
    let defaultInspection =  relevantInspections['inspections'][0]
    setInspections(relevantInspections)
    setCurrentInspection(relevantInspections[defaultInspection['id']])
  }

  return(
    <div className='uniform-inspection-result-page'>
      <div className='page-container'>
        <h2>Results of past uniform inspections</h2>
        <label>Viewing results of: </label>
        {boys.length != 0 && <select onChange={selectBoy}>
          {boys.map((boy) => {
            return(
              <option key={boy.id} value={boy.id}>{boy.rank} {boy.account_name}</option>
            )
          })
          }
        </select>}
        <label>Viewing inspection from: </label>
        {inspections != null && inspections['inspections'].length != 0 && <select className='date-select' onChange={selectInspection}>
          {inspections['inspections'].map((inspection) => {
            return(
              <option key={inspection.id} value={inspection.id}>{inspection['date']}</option>
            )
          })}
        </select>}
        <br/>
        {currentInspection != null && <label>Assessor: {currentInspection['assessor']['rank']} {currentInspection['assessor']['account_name']}</label>}
        {currentInspection != null && <label>Score: {currentInspection['inspection']['total_score']}</label>}
        {currentInspection != null && components.map((component) => {
          return(
            <div key={component.id}>
              <h3>{component.component_name}</h3>
              {componentFields[component.component_name].map((field) => {
                return(
                  <div key={field.id}>
                    <input type='checkbox' disabled checked={currentInspection['selected_components'][field.id] != null}></input>
                    <label>{field.description}</label>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { UniformInspectionResultPage }