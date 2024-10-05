import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// To view awards information and delete award accounts
const AwardInformation = ({ awardId }) => {
  const [award, setAward] = useState();
  const [masteries, setMasteries] = useState([{mastery_name: 'Basic', mastery_requirements: '', results_description: '', recommended_level: ''},
   {mastery_name: 'Advanced', mastery_requirements: '', results_description: '', recommended_level: ''},
   {mastery_name: 'Master', mastery_requirements: '', results_description: '', recommended_level: ''}]);
  const [hasMastery, setHasMastery] = useState(false);

  useEffect(() => {
    setAward()
    axios.post('/api/award/' + awardId + '/get_award', {
      'id': awardId
    }, {
      withCredentials: true
    })
    .then(resp => {
      setAward(resp.data)
      setHasMastery(resp.data.has_mastery)
      if (resp.data.has_mastery) {
        axios.post('/api/award/0/get_masteries', {
          'award_id': awardId
        }, {
          withCredentials: true
        })
        .then(resp => {
          setMasteries(resp.data)
        })
        .catch(resp => handleServerError(resp.response.status))
      }
    })
    .catch(resp => handleServerError(resp.response.status))
  }, [awardId])

  return(
    <div className='award-information'>
      {award != null && <div className="edit-award-form">
        <h1>Badge name: {award.badge_name}</h1>
        <br/>
        {award != null && !hasMastery && <div>
          <h2>Badge requirements (description of requirements): </h2>
          <br/>
          <label className='edit-field'>{award.badge_requirements}</label>
          <br/>
          <h2>Recommended level for completion: Sec {award.recommended_level}</h2>
        </div>}
        {award != null && hasMastery && masteries.map((mastery) => {
          return (
            <div key={awardId + "-" + mastery.mastery_name}>
              <br/>
              <h1>{mastery.mastery_name}</h1>
              <br/>
              <h2>Badge requirements (description of requirements): </h2>
              <br/>
              <label className='edit-field'>{mastery.mastery_requirements}</label>
              <br/>
              <h2>Recommended level for completion: Sec {mastery.recommended_level}</h2>
              <br/>
            </div>
          )
        })}
      </div>}
    </div>
  )
}

AwardInformation.propTypes = {
  awardId: PropTypes.number.isRequired
}

export { AwardInformation }