import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'

/*To facilitate uniform inspection by officers / primers
*/
const UniformInspectionPage = () => {
  const [inspections, setInspections] = useState();

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then()
  .catch(() => {window.location.href = '/'})

  useEffect(() => {
    axios.post('/api/uniform_inspection/0/get_inspections', {}, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setInspections(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  function uniformInspectionForm(e) {
    window.location.href = '/uniform_inspection_form/' + e.target.id
  }

  return(
    <div className='uniform-inspection-page'>
      <NavigationBar/>
      <div className='page-container'>
        <h2>Previous Uniform Inspection</h2>
        {inspections != null && <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Latest Score</th>
              <th>Date</th>
              <th>Assessor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inspections['boys'].map((boy) => {
              if (inspections[boy.id] == null) {
                return (
                  <tr key={boy.account_name} className='button'>
                    <td>{boy.account_name}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td><label>no attempt yet</label></td>
                  </tr>
                )
              }
              else {
                return (
                  <tr key={inspections[boy.id].id} id={inspections[boy.id].id} className='button'>
                    <td>{boy.account_name}</td>
                    <td>{inspections[boy.id].total_score}</td>
                    <td>{inspections[boy.id].date}</td>
                    <td>{inspections[inspections[boy.id].assessor_id].account_name}</td>
                    <td className="view-attempts"><a href={'/view_uniform_inspection/' + inspections[boy.id].id}>view records</a></td>
                  </tr>
                )
              }
            })}
          </tbody>
        </table>}
        <br/>
        <button onClick={uniformInspectionForm}>Conduct Uniform Inspection</button>
      </div>
    </div>
  )
}

export { UniformInspectionPage }