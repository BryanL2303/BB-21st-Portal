import React, {useState, useEffect, useContext} from 'react'
import Popup from 'reactjs-popup';
import axios from 'axios'
import Cookies from 'universal-cookie';
import { AwardContext } from '../context/AwardContext'

/*To access questions and create new ones
*/
const QuizList = () => {
  const cookies = new Cookies();
  const [award, setAward] = useContext(AwardContext)
  const [currentAward, setCurrentAward] = useState()
  const [masteries, setMasteries] = useState()
  const [currentMastery, setCurrentMastery] = useState()
  const [assignments, setAssignments] = useState([])
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    axios.post('/api/award/' + award.awardId + '/get_award', {
      id: award.awardId
    })
    .then(resp => {
      setCurrentAward(resp.data)
      if (resp.data.has_mastery) {
        axios.post('/api/award/0/get_masteries', {
          award_id: award.awardId
        })
        .then( resp => {
          setMasteries(resp.data)
          setCurrentMastery(resp.data[0])
          setAward({awardId: award.awardId, masteryId: resp.data[0].id})
        })
        .catch(resp => errorMessage(resp.response.statusText))
      } else {
        setMasteries()
        setCurrentMastery()
        setAward({awardId: award.awardId, masteryId: '0'})
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
    axios.post('/api/assignment/0/get_assignments', {
      award: award
    })
    .then( resp => {
      setAssignments(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
    axios.post('/api/quiz/0/get_quizzes', {
      award: award
    })
    .then( resp => {
      setQuizzes(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [])

  useEffect(() => {
    axios.post('/api/award/' + award.awardId + '/get_award', {
      id: award.awardId
    })
    .then(resp => {
      setCurrentAward(resp.data)
      if (resp.data.has_mastery && award.masteryId == '0') {
        axios.post('/api/award/0/get_masteries', {
          award_id: award.awardId
        })
        .then( resp => {
          setMasteries(resp.data)
          setCurrentMastery(resp.data[0])
          setAward({awardId: award.awardId, masteryId: resp.data[0].id})
        })
        .catch(resp => errorMessage(resp.response.statusText))
      } else if (!resp.data.has_mastery) {
        setMasteries()
        setCurrentMastery()
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
    axios.post('/api/assignment/0/get_assignments', {
      award: award
    })
    .then( resp => {
      setAssignments(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
    axios.post('/api/quiz/0/get_quizzes', {
      award: award
    })
    .then( resp => {
      setQuizzes(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [award])

  //Go to QuizCreationPage
  function quizCreationPage(e) {
    window.location.href = '/quiz_creation'
  }

  //View an assignment
  function editAssignmentPage(e) {
    e.preventDefault()
    window.location.href = '/view_assignment/' + e.target.className
  }

  //View a quiz
  function editQuizPage(e) {
    e.preventDefault()
    window.location.href = '/view_quiz/' + e.target.className
  }

  function showMastery(e) {
    e.preventDefault()
    setCurrentMastery(masteries[e.target.id])
    setAward({awardId: currentAward.id, masteryId: masteries[e.target.id]})
  }

  return(
    <div className='quiz-list-block'>
      {masteries != null && <div className='mastery-selector'>
          {masteries.map((mastery, index) => {
            return(
              <button id={index} onClick={showMastery}>{mastery.mastery_name}</button>
            )
          })}
        </div>}

      <div className='quiz-list'>
        {currentAward != null && currentMastery == null && <h1>{currentAward.badge_name}</h1>}
        {currentAward != null && currentMastery != null && <h1>{currentAward.badge_name} {currentMastery.mastery_name}</h1>}
        <h2>Assigned Tests</h2>
        {assignments.map((assignment) => {
          return (
            <button className={assignment.id} onClick={editAssignmentPage}>{assignment.assignment_name}</button>
          )
        })}
        <h2>Quizzes</h2>
        {quizzes.map((quiz) => {
          return (
            <button className={quiz.id} onClick={editQuizPage}>{quiz.quiz_name} [- / {quiz.marks}]</button>
          )
        })}
        <button onClick={quizCreationPage}>Create a new quiz</button>
      </div>
    </div>
  )
}

export { QuizList }