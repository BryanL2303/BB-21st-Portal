import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { AwardContext } from '../context/AwardContext'
import { handleServerError } from '../general/handleServerError'

/*To access quizes and create new ones
*/
const QuizList = () => {
  const [award, setAward] = useContext(AwardContext)
  const [currentAward, setCurrentAward] = useState()
  const [masteries, setMasteries] = useState()
  const [currentMastery, setCurrentMastery] = useState()
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
        .catch(resp => handleServerError(resp.response.status))
      } else {
        setMasteries()
        setCurrentMastery()
        setAward({awardId: award.awardId, masteryId: '0'})
      }
    })
    .catch(resp => handleServerError(resp.response.status))
    axios.post('/api/account/0/get_assignments', {
      'award': award
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then( resp => {
      setQuizzes(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
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
        }, {
          withCredentials: true  // Include credentials (cookies)
        })
        .then( resp => {
          setMasteries(resp.data)
          setCurrentMastery(resp.data[0])
          setAward({awardId: award.awardId, masteryId: resp.data[0].id})
        })
        .catch(resp => handleServerError(resp.response.status))
      } else if (!resp.data.has_mastery) {
        setMasteries()
        setCurrentMastery()
      }
    })
    .catch(resp => handleServerError(resp.response.status))
    axios.post('/api/account/0/get_assignments', {
      'award': award
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then( resp => {
      setQuizzes(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
  }, [award])

  //View a quiz
  function viewQuiz(e) {
    e.preventDefault()
    window.location.href = '/quiz_result/' + e.target.className
  }

  function showMastery(e) {
    e.preventDefault()
    setCurrentMastery(masteries[e.target.id])
    setAward({awardId: currentAward.id, masteryId: masteries[e.target.id]})
  }

  return(
    <div className='quiz-list-block'>
      {masteries != null && <div className='mastery-selector'>
          <button id={0} onClick={showMastery}>Basic</button>
          <button id={1} onClick={showMastery}>Advanced</button>
          <button id={2} onClick={showMastery}>Master</button>
        </div>}

      <div className='quiz-list'>
        {currentAward != null && currentMastery == null && <h1>{currentAward.badge_name}</h1>}
        {currentAward != null && currentMastery != null && <h1>{currentAward.badge_name} {currentMastery.mastery_name}</h1>}
        <br/>
        <h2>Complete these tests assigned to you!</h2>
        {quizzes.map((quiz) => {
          return(
            <button key={quiz.id} className={quiz.id} onClick={viewQuiz}>{quiz.quiz_name}</button>
          )
        })}
        <h2>Test Yourself!</h2>
        <button>
          <h3>Practise Quiz</h3>
          <br/>
          <p> Complete a quiz with 10 random questions from the question bank!</p>
        </button>
      </div>
    </div>
  )
}

export { QuizList }