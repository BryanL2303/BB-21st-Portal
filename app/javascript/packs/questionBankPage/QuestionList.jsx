import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { AwardContext } from '../context/AwardContext'
import { handleServerError } from '../general/handleServerError'
import { QuestionCreationForm } from './QuestionCreationForm'
import { McqOptionsEditor } from './McqOptionsEditor'
import { MrqOptionsEditor } from './MrqOptionsEditor'
import { OpenEndedRubricEditor } from './OpenEndedRubricEditor'

/*To access questions and create new ones
*/
const QuestionList = () => {
  const [award, setAward] = useContext(AwardContext)
  const [currentAward, setCurrentAward] = useState()
  const [masteries, setMasteries] = useState()
  const [currentMastery, setCurrentMastery] = useState()
  const [mcqQuestions, setMcqQuestions] = useState([])
  const [mrqQuestions, setMrqQuestions] = useState([])
  const [openEndQuestions, setOpenEndQuestions] = useState([])

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
    axios.post('/api/question/0/get_questions', {
      award: award,
      question_type: 'MCQ'
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then( resp => {
      setMcqQuestions(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
    axios.post('/api/question/0/get_questions', {
      award: award,
      question_type: 'MRQ'
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then( resp => {
      setMrqQuestions(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
    axios.post('/api/question/0/get_questions', {
      award: award,
      question_type: 'Open-ended'
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then( resp => {
      setOpenEndQuestions(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
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
        .catch(resp => handleServerError(resp.response.status))
      } else if (!resp.data.has_mastery) {
        setMasteries()
        setCurrentMastery()
      }
    })
    .catch(resp => handleServerError(resp.response.status))
    axios.post('/api/question/0/get_questions', {
      award: award,
      question_type: 'MCQ'
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then( resp => {
      setMcqQuestions(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
    axios.post('/api/question/0/get_questions', {
      award: award,
      question_type: 'MRQ'
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then( resp => {
      setMrqQuestions(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
    axios.post('/api/question/0/get_questions', {
      award: award,
      question_type: 'Open-ended'
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then( resp => {
      setOpenEndQuestions(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
  }, [award])

  function showMastery(e) {
    e.preventDefault()
    setCurrentMastery(masteries[e.target.id])
    setAward({awardId: currentAward.id, masteryId: masteries[e.target.id]})
  }

  return(
    <div className='question-list-page'>
      {masteries != null && <div className='mastery-selector'>
          {masteries.map((mastery, index) => {
            return(
              <button key={index} id={index} onClick={showMastery}>{mastery.mastery_name}</button>
            )
          })}
        </div>}

      {currentAward != null && currentMastery == null && <h1>Questions - {currentAward.badge_name}</h1>}
      {currentAward != null && currentMastery != null && <h1>Questions - {currentAward.badge_name} {currentMastery.mastery_name}</h1>}
      <QuestionCreationForm/>
      <br/>
      
      <div className='question-list'>
        <h2>MCQ Questions</h2>
        {mcqQuestions.map((question) => {
          return (
            <McqOptionsEditor key={question.id} question={question}/>
          )
        })}
        <h2>MRQ Questions</h2>
        {mrqQuestions.map((question) => {
          return (
            <MrqOptionsEditor key={question.id} question={question}/>
          )
        })}
        <h2>Open-ended Questions</h2>
        {openEndQuestions.map((question) => {
          return (
            <OpenEndedRubricEditor key={question.id} question={question}/>
          )
        })}
      </div>
    </div>
  )
}

export { QuestionList }