import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { AwardContext } from '../context/AwardContext'

/*To access questions and create new ones
*/
const QuizList = () => {
  const [award, setAward] = useContext(AwardContext)
  const [currentAward, setCurrentAward] = useState()
  const [masteries, setMasteries] = useState()
  const [currentMastery, setCurrentMastery] = useState()
  const [assignments, setAssignments] = useState([])
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    axios.post('/api/award/' + award.awardId + '/get_award', {
      id: award.awardId
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setCurrentAward(resp.data)
      if (resp.data.has_mastery) {
        axios.post('/api/award/0/get_masteries', {
          award_id: award.awardId
        }, {
          withCredentials: true  // Include credentials (cookies)
        })
        .then( resp => {
          setMasteries(resp.data)
          setCurrentMastery(resp.data[0])
          setAward({awardId: award.awardId, masteryId: resp.data[0].id})
        })
        .catch(error => {console.log(error)})
      } else {
        setMasteries()
        setCurrentMastery()
        setAward({awardId: award.awardId, masteryId: '0'})
      }
    })
    .catch(error => {console.log(error)})
    axios.post('/api/assignment/0/get_assignments', {
      award: award
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then( resp => {
      setAssignments(resp.data)
    })
    .catch(error => {console.log(error)})
    axios.post('/api/quiz/0/get_quizzes', {
      award: award
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then( resp => {
      setQuizzes(resp.data)
    })
    .catch(error => {console.log(error)})
  }, [])

  useEffect(() => {
    axios.post('/api/award/' + award.awardId + '/get_award', {
      id: award.awardId
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setCurrentAward(resp.data)
      if (resp.data.has_mastery && award.masteryId == '0') {
        axios.post('/api/award/0/get_masteries', {
          award_id: award.awardId
        }, {
          withCredentials: true  // Include credentials (cookies)
        })
        .then( resp => {
          setMasteries(resp.data)
          setCurrentMastery(resp.data[0])
          setAward({awardId: award.awardId, masteryId: resp.data[0].id})
        })
        .catch(error => {console.log(error)})
      } else if (!resp.data.has_mastery) {
        setMasteries()
        setCurrentMastery()
      }
    })
    .catch(error => {console.log(error)})
    axios.post('/api/assignment/0/get_assignments', {
      award: award
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then( resp => {
      setAssignments(resp.data)
    })
    .catch(error => {console.log(error)})
    axios.post('/api/quiz/0/get_quizzes', {
      award: award
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then( resp => {
      setQuizzes(resp.data)
    })
    .catch(error => {console.log(error)})
  }, [award])

  //Go to QuizCreationPage
  function quizCreationPage() {
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
              <button key={index} id={index} onClick={showMastery}>{mastery.mastery_name}</button>
            )
          })}
        </div>}

      <div className='quiz-list'>
        {currentAward != null && currentMastery == null && <h1>{currentAward.badge_name}</h1>}
        {currentAward != null && currentMastery != null && <h1>{currentAward.badge_name} {currentMastery.mastery_name}</h1>}
        <h2>Assigned Tests</h2>
        {assignments.map((assignment) => {
          return (
            <button key={assignment.id + "-assignment-button"} className={assignment.id} onClick={editAssignmentPage}>{assignment.assignment_name}</button>
          )
        })}
        <h2>Quizzes</h2>
        {quizzes.map((quiz) => {
          return (
            <button key={quiz.id + "-quiz-button"} className={quiz.id} onClick={editQuizPage}>{quiz.quiz_name} [- / {quiz.marks}]</button>
          )
        })}
        <button onClick={quizCreationPage}>Create a new quiz</button>
      </div>
    </div>
  )
}

export { QuizList }