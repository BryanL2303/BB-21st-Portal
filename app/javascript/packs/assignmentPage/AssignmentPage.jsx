import React, { useEffect, useState, useContext } from 'react'
import Popup from 'reactjs-popup';
import { useParams } from 'react-router-dom'
import Cookies from 'universal-cookie'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'
import {AssignedAccountDisplay} from './AssignedAccountDisplay'

/*For officers/primers to view assignment progress
*/
const AssignmentPage = () => {
  const cookies = new Cookies()
  const [quiz, setQuiz] = useState();
  const [assignment, setAssignment] = useState();
  const [assignedAccounts, setAssignedAccounts] = useState([]);
  const [assignees, setAssignees] = useState(0);
  const [passees, setPassees] = useState(0);
  const { id } = useParams()

  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
  }

  useEffect(() => {
    //make axios call and set Quiz and Questions
    axios.post('/api/assignment/' + id + '/get_assignment', {
      'id': id
    })
    .then(resp => {
      axios.post('/api/quiz/' + resp.data.quiz_id + '/get_quiz', {
        'id': resp.data.quiz_id
      })
      .then(resp => {
        setQuiz(resp.data)
      })
      .catch(resp => errorMessage(resp.response.statusText))
      setAssignment(resp.data)
      axios.post('/api/assigned_account/0/get_assigned_accounts', {
        'assignment_id': resp.data.id
      })
      .then(resp => {
        setAssignedAccounts(resp.data)
        setAssignees(resp.data.length)
      })
      .catch(resp => errorMessage(resp.response.statusText))
      })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  function deleteAssignment(e) {
    axios.post('/api/assignment/' + e.target.id + '/delete_assignment', {
      'id': e.target.id
    })
    .then(resp => {
      window.location.href = '/quiz_bank'
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  function renderResults(e) {
    window.location.href = '/view_result/' + assignment.id
  }

  return(
    <div className="assignment-page">
      <NavigationBar/>
      {assignment != null && quiz != null && <div className="assignment-description">
        <h2>{quiz.quiz_name}</h2>
        <p>Boys that has passed: {passees} / {assignees}</p>
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
              <AssignedAccountDisplay assignedAccount={assignedAccount} passees={passees} setPassees={setPassees}/>
            )
          })}
        </tbody>
      </table>
      {assignment != null && <button id={assignment.id} className="results-button" onClick={deleteAssignment}>Delete Assignment</button>}
      <button className="results-button" onClick={renderResults}>Render 32A results</button>
    </div>
  )
}

export { AssignmentPage }