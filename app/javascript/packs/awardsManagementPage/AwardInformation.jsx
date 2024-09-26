import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

/*To view awards information and delete award accounts
*/
const AwardInformation = ({awardId}) => {
  const [award, setAward] = useState();
  const [masteries, setMasteries] = useState([{mastery_name: 'Basic', mastery_requirements: '', results_description: '', recommended_level: ''},
   {mastery_name: 'Advanced', mastery_requirements: '', results_description: '', recommended_level: ''},
   {mastery_name: 'Master', mastery_requirements: '', results_description: '', recommended_level: ''}]);
  const [hasMastery, setHasMastery] = useState(false);
  const [level1, setRecommendedLevel1] = useState()
  const [level2, setRecommendedLevel2] = useState()
  const [level3, setRecommendedLevel3] = useState()

  useEffect(() => {
    setAward()
    axios.post('/api/award/' + awardId + '/get_award', {
      'id': awardId
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setAward(resp.data)
      setHasMastery(resp.data.has_mastery)
      if (resp.data.has_mastery) {
        axios.post('/api/award/0/get_masteries', {
          'award_id': awardId
        })
        .then(resp => {
          setMasteries(resp.data)
          setRecommendedLevel1(resp.data[0].recommended_level)
          setRecommendedLevel2(resp.data[1].recommended_level)
          setRecommendedLevel3(resp.data[2].recommended_level)
        })
        .catch(error => console.log(error))
      } else {
        setRecommendedLevel1(resp.data.recommended_level)
      }
    })
    .catch(error => console.log(error))
  }, [awardId])

  function editAward(e) {
    e.preventDefault()
    let details = []
    let submit = true
    if (e.target[0].value == '' || e.target[1].value == '') {
      submit = false
    }
    if (!e.target[1].checked) {
      if (e.target[2].value == '' || e.target[3].value == '') {
        submit = false
      }
      details.push({'badge_requirements': e.target[2].value, 'results_description': e.target[3].value, 'recommended_level': level1, 'require_certification': e.target[4].checked})
    } else {
      if (e.target[2].value == '' || e.target[3].value == '') {
        submit = false
      }
      details.push({'id': e.target[2].id, 'mastery_requirements': e.target[2].value, 'results_description': e.target[3].value, 'recommended_level': level1, 'require_certification': e.target[4].checked})
      if (e.target[5].value == '' || e.target[6].value == '') {
        submit = false
      }
      details.push({'id': e.target[5].id, 'mastery_requirements': e.target[5].value, 'results_description': e.target[6].value, 'recommended_level': level2, 'require_certification': e.target[7].checked})
      if (e.target[8].value == '' || e.target[9].value == '') {
        submit = false
      }
      details.push({'id': e.target[8].id, 'mastery_requirements': e.target[8].value, 'results_description': e.target[9].value, 'recommended_level': level3, 'require_certification': e.target[10].checked})
    }
    if (submit) {
      axios.post('/api/award/' + awardId + '/edit_award', {
        id: awardId,
        badge_name: e.target[0].value,
        has_mastery: e.target[1].checked,
        details: details
      }, {
        withCredentials: true  // Include credentials (cookies)
      })
      .then(resp => {
        if (resp.data != false) {
          alert("Award has been updated, please refresh the page to update award information")
        }
        else{
          alert("Failed to update")
        }
      })
      .catch(resp => console.log(resp.response.statusText))
    }
    else {
      alert("Please fill in all fields first")
    }
  }

  return(
    <div className='award-information'>
      {award != null && <form className="edit-award-form" onSubmit={editAward}>
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
      </form>}
    </div>
  )
}

AwardInformation.propType = {
  awardId: PropTypes.number.isRequired
}

export { AwardInformation }