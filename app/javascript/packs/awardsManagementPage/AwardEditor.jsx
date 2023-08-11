import React, { useEffect, useState, useContext } from 'react'
import Popup from 'reactjs-popup';
import Cookies from 'universal-cookie'
import axios from 'axios'

/*To edit awards information and delete award only accessible by the Administrator
*/
const AwardEditor = ({awardId}) => {
  const cookies = new Cookies()
  const [award, setAward] = useState();
  const [masteries, setMasteries] = useState([]);
  const [hasMastery, setHasMastery] = useState(false);
  const [level1, setRecommendedLevel1] = useState()
  const [level2, setRecommendedLevel2] = useState()
  const [level3, setRecommendedLevel3] = useState()

  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
  }

  useEffect(() => {
    setAward()
    setMasteries([])
    axios.post('/api/award/' + awardId + '/get_award', {
      'id': awardId
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
        .catch(resp => errorMessage(resp.response.statusText))
      } else {
        setRecommendedLevel1(resp.data.recommended_level)
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }, [awardId])

  function setLevel(e) {
    e.preventDefault()
    document.getElementsByClassName('create-award-form__level')[0].innerHTML = e.target.className
    setRecommendedLevel1(e.target.className)
  }

  function setLevel2(e) {
    e.preventDefault()
    let m = 0
    if (e.target.id == "Advanced") {
      m = 1
      setRecommendedLevel2(e.target.className)
    }
    if (e.target.id == "Master") {
      m = 2
      setRecommendedLevel3(e.target.className)
    }
    document.getElementsByClassName('create-award-form__level')[m].value = e.target.className
  }

  function toggleHasMastery(e) {
    setHasMastery(e.target.checked)
  }

  function updateHeight(e) {
    let descriptionBox = e.target
    descriptionBox.style['height'] = '0px'
    descriptionBox.style['height'] = `${descriptionBox.scrollHeight}px`
  }

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

  function deleteAward(e) {
    e.preventDefault()
    axios.post('/api/award/' + awardId + '/delete_award', {
      id: awardId
    })
    .then(resp => {
      if (resp.data != false) {
        //Reload the awards list on the side and reset back to award creation form
        alert("Please refresh the page")
      }
      else{
        alert("Please refresh the page")
      }
    })
    .catch(resp => errorMessage(resp.response.statusText))
  }

  return(
    <div className='award-information'>
      {award != null && <form className="edit-award-form" onSubmit={editAward}>
        <label>Badge name: </label>
        <input className='edit-field' defaultValue={award.badge_name}></input>
        <br/>
        <label>This badge has mastery levels: </label>
        <input type='checkbox' defaultChecked={award.has_mastery} onClick={toggleHasMastery}></input>
        <br/>
        {award != null && !hasMastery && <div>
          <label>Badge requirements (description of requirements): </label>
          <br/>
          <textarea className='edit-field' defaultValue={award.badge_requirements} onChange={updateHeight}></textarea>
          <br/>
          <label>Result descriptions (the description that should appear in the results for 32A form): </label>
          <br/>
          <textarea className='edit-field' defaultValue={award.results_description} onChange={updateHeight}></textarea>
          <br/>
          <label>Recommended level for completion: Sec </label>
          <Popup className='award-level-popup' trigger={<label className='create-award-form__level'>{award.recommended_level}</label>} position="bottom">
            <p className='5' onClick={setLevel}>5</p>
            <p className='4' onClick={setLevel}>4</p>
            <p className='3' onClick={setLevel}>3</p>
            <p className='2' onClick={setLevel}>2</p>
            <p className='1' onClick={setLevel}>1</p>
          </Popup>
          <br/>
          <label>This badge requires results: </label>
          <input className='create-award-form__certification' type='checkbox' defaultChecked={award.has_results}></input>
          <br/>
          <label>This badge requires pass/fail: </label>
          <input className='create-award-form__certification' type='checkbox' defaultChecked={award.has_pass}></input>
          <br/>
          <label>This badge requires custom descriptions: </label>
          <input className='create-award-form__certification' type='checkbox' defaultChecked={award.custom_description}></input>
          <br/>
          {award.custom_description && <label>Result descriptions cue (To cue the user on what they need to include in the description): </label>}
          {award.custom_description && <br/>}
          {award.custom_description && <textarea className='edit-field' defaultValue={award.description_cue} onChange={updateHeight}></textarea>}
          {award.custom_description && <br/>}
          <label>This badge requires custom columns: </label>
          <input className='create-award-form__certification' type='checkbox' defaultChecked={award.has_custom_columns}></input>
          <br/>
        </div>}
        {award != null && hasMastery && masteries.map((mastery, index) => {
          return (
            <div>
              <br/>
              <label style={{fontSize: '20px'}}>{mastery.mastery_name}</label>
              <br/>
              <label>Badge requirements (description of requirements): </label>
              <br/>
              <textarea id={mastery.id} className='edit-field' defaultValue={mastery.mastery_requirements} onChange={updateHeight}></textarea>
              <br/>
              {!mastery.custom_description && <label>Result descriptions (the description that should appear in the results for 32A form): </label>}
              {!mastery.custom_description && <br/>}
              {!mastery.custom_description && <textarea className='edit-field' defaultValue={mastery.results_description} onChange={updateHeight}></textarea>}
              {!mastery.custom_description && <br/>}
              <label>Recommended level for completion: Sec </label>
              <Popup className='award-level-popup' trigger={<label className='create-award-form__level'>{mastery.recommended_level}</label>} position="bottom">
                <p id={mastery.mastery_name} className='5' onClick={setLevel2}>5</p>
                <p id={mastery.mastery_name} className='4' onClick={setLevel2}>4</p>
                <p id={mastery.mastery_name} className='3' onClick={setLevel2}>3</p>
                <p id={mastery.mastery_name} className='2' onClick={setLevel2}>2</p>
                <p id={mastery.mastery_name} className='1' onClick={setLevel2}>1</p>
              </Popup>
              <br/>
              <label>This badge requires results: </label>
              <input className='create-award-form__certification' type='checkbox' defaultChecked={mastery.has_results}></input>
              <br/>
              <label>This badge requires pass/fail: </label>
              <input className='create-award-form__certification' type='checkbox' defaultChecked={mastery.has_pass}></input>
              <br/>
              <label>This badge requires custom descriptions: </label>
              <input className='create-award-form__certification' type='checkbox' defaultChecked={mastery.custom_description}></input>
              <br/>
              {mastery.custom_description && <label>Result descriptions cue (To cue the user on what they need to include in the description): </label>}
              {mastery.custom_description && <br/>}
              {mastery.custom_description && <textarea className='edit-field' defaultValue={mastery.description_cue} onChange={updateHeight}></textarea>}
              {mastery.custom_description && <br/>}
              <label>This badge requires custom columns: </label>
              <input className='create-award-form__certification' type='checkbox' defaultChecked={mastery.has_custom_columns}></input>
              <br/>
            </div>
          )
        })}
        {false && <button className="edit-button">Save Changes</button>}
      </form>}
      {false && <button className="delete-button" onClick={deleteAward}>Delete Award</button>}
    </div>
  )
}

export { AwardEditor }