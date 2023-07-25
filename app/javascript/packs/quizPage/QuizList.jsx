import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie';
import { AwardContext } from '../context/AwardContext'

/*To access quizes and create new ones
*/
const QuizList = () => {
  const cookies = new Cookies();
  const [award, setAward] = useContext(AwardContext)
  const [currentAward, setCurrentAward] = useState()
  const [masteries, setMasteries] = useState()
  const [currentMastery, setCurrentMastery] = useState()
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
    axios.post('/api/account/0/get_assignments', {
      'token': cookies.get("Token"),
      'award': award
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
    axios.post('/api/account/0/get_assignments', {
      'token': cookies.get("Token"),
      'award': award
    })
    .then( resp => {
      setQuizzes(resp.data)
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [award])

  //View a quiz
  function viewQuiz(e) {
    e.preventDefault()
    window.location.href = '/quiz/' + e.target.className
  }

  function showMastery(e) {
    e.preventDefault()
    setCurrentMastery(masteries[e.target.id])
    setAward({awardId: currentAward.id, masteryId: masteries[e.target.id]})
  }

  return(
    <div className='quiz-list'>
      {masteries != null && <div>
          <button id={0} onClick={showMastery}>Basic</button>
          <button id={1} onClick={showMastery}>Advanced</button>
          <button id={2} onClick={showMastery}>Master</button>
        </div>}

      {currentAward != null && currentMastery == null && <h1>{currentAward.badge_name}</h1>}
      {currentAward != null && currentMastery != null && <h1>{currentAward.badge_name} {currentMastery.mastery_name}</h1>}
      <br/>
      <h2>Complete these tests assigned to you!</h2>
      {quizzes.map((quiz) => {
        return(
          <button className={quiz.id} onClick={viewQuiz}>{quiz.quiz_name}</button>
        )
      })}
      <h2>Test Yourself!</h2>
      <button>
        <h3>Practise Quiz</h3>
        <br/>
        <p>Complete a quiz with 10 random questions from the question bank!</p>
      </button>
    </div>
  )
}

export { QuizList }