import React, { useEffect, useState, useContext } from 'react'
import Popup from 'reactjs-popup';
import { useParams } from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'

/*To facilitate uniform inspection by officers / primers
*/
const UniformInspectionResultPage = () => {
  const cookies = new Cookies()
  const [components, setComponents] = useState([]);
  const [componentFields, setComponentFields] = useState({})
  const [currentBoy, setCurrentBoy] = useState();
  const [currentInspection, setCurrentInspection] = useState()
  const [inspections, setInspections] = useState();
  const [allInspections, setAllInspections] = useState();
  const [boys, setBoys] = useState([]);
  const { id } = useParams()

  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
  }

  useEffect(() => {
    axios.post('/api/uniform_inspection/0/get_component_fields', {
    })
    .then(resp => {
      setComponents(resp.data['components'])
      setComponentFields(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
    axios.post('/api/uniform_inspection/' + id + '/get_inspection', {
      'id': id
    })
    .then(resp => {
      setCurrentBoy(resp.data['boy'])
      setAllInspections(resp.data['inspections'])
      setInspections(resp.data['inspections'][resp.data['boy']['id']])
      setCurrentInspection(resp.data['inspections'][resp.data['boy']['id']][id])
      setBoys(resp.data['boys'])
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  function selectInspection(e) {
    setCurrentInspection(inspections[e.target.value])
  }

  function selectBoy(e) {
    setCurrentBoy(boys[e.target.value])
    let relevantInspections = allInspections[e.target.value]
    let defaultInspection =  relevantInspections['inspections'][0]
    setInspections(relevantInspections)
    setCurrentInspection(relevantInspections[defaultInspection['id']])
  }

  return(
    <div className='uniform-inspection-result-page'>
      <NavigationBar/>
      <div className='page-container'>
        <h2>Results of past uniform inspections</h2>
        <label>Viewing results of: </label>
        {boys.length != 0 && <select onChange={selectBoy}>
          {boys.map((boy) => {
            return(
              <option value={boy.id}>{boy.rank} {boy.account_name}</option>
            )
          })
          }
        </select>}
        <label>Viewing inspection from: </label>
        {inspections != null && inspections['inspections'].length != 0 && <select className='date-select' onChange={selectInspection}>
          {inspections['inspections'].map((inspection) => {
            return(
              <option value={inspection.id}>{inspection['date']}</option>
            )
          })}
        </select>}
        <br/>
        {currentInspection != null && <label>Assessor: {currentInspection['assessor']['rank']} {currentInspection['assessor']['account_name']}</label>}
        {currentInspection != null && <label>Score: {currentInspection['inspection']['total_score']}</label>}
        {currentInspection != null && components.map((component) => {
          return(
            <div>
              <h3>{component.component_name}</h3>
              {componentFields[component.component_name].map((field) => {
                return(
                  <div>
                    <input type='checkbox' disabled checked={currentInspection['selectedComponents'][field.id] != null}></input>
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