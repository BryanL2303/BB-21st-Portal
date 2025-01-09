import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'
import { handleServerError } from '../general/handleServerError'
import {AssignedAccountDisplay} from './AssignedAccountDisplay'

/*For officers/primers to view assignment progress
*/
const AssignmentPage = () => {
  const [quiz, setQuiz] = useState();
  const [assignment, setAssignment] = useState();
  const [assignedAccounts, setAssignedAccounts] = useState([]);
  const [passees, setPassees] = useState(0);
  const { id } = useParams()

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then()
  .catch(window.location.href = '/')

  useEffect(() => {
    //make axios call and set Quiz and Questions
    axios.post('/api/assignment/' + id + '/get_assignment', {
      'id': id
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      axios.post('/api/quiz/' + resp.data.quiz_id + '/get_quiz', {
        'id': resp.data.quiz_id
      }, {
        withCredentials: true  // Include credentials (cookies)
      })
      .then(resp => {
        setQuiz(resp.data)
      })
      .catch(resp => handleServerError(resp.response.status))
      setAssignment(resp.data)
      axios.post('/api/assigned_account/0/get_assigned_accounts', {
        'assignment_id': resp.data.id
      }, {
        withCredentials: true  // Include credentials (cookies)
      })
      .then(resp => {
        setAssignedAccounts(resp.data)
      })
      .catch(resp => handleServerError(resp.response.status))
      })
    .catch(resp => handleServerError(resp.response.status))
  }, [])

  function deleteAssignment(e) {
    axios.post('/api/assignment/' + e.target.id + '/delete_assignment', {
      'id': e.target.id
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(window.location.href = '/quiz_bank')
    .catch(resp => handleServerError(resp.response.status))
  }

  return(
    <div className="assignment-page">
      <NavigationBar/>
      {assignment != null && quiz != null && <div className="assignment-description">
        <h2>{quiz.quiz_name}</h2>
      </div>}
      {assignment == null && <p>Some how assignment is null</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Attempts</th>
            <th>Best Score</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {quiz != null && assignedAccounts.map((assignedAccount) => {
            return(
              <AssignedAccountDisplay key={assignedAccount.id} assignedAccount={assignedAccount} passees={passees} setPassees={setPassees}/>
            )
          })}
        </tbody>
      </table>
      {assignment != null && <button id={assignment.id} className="results-button" onClick={deleteAssignment}>Delete Assignment</button>}
    </div>
  )
}

//<p>Boys that has passed: {passees} / {assignees}</p>

export { AssignmentPage }