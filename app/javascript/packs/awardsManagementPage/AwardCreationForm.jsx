import React, { useState, useContext } from 'react'
import Popup from 'reactjs-popup';
import Cookies from 'universal-cookie'
import axios from 'axios'

/*To create new awards
*/
const AwardCreationForm = () => {
  const cookies = new Cookies()
  const [hasMastery, setHasMastery] = useState(true);
  const [level1, setRecommendedLevel1] = useState('1')
  const [level2, setRecommendedLevel2] = useState('1')
  const [level3, setRecommendedLevel3] = useState('1')

  //If there is no ongoing session go to login page
  if (cookies.get('Token') == null) {
    window.location.href = '/'
  }

  function setLevel(e) {
    e.preventDefault()
    document.getElementsByClassName('create-award-form__level')[0].innerHTML = e.target.className
    setRecommendedLevel1(e.target.className)
  }

  function setLevel2(e) {
    e.preventDefault()
    document.getElementsByClassName('create-award-form__level')[1].innerHTML = e.target.className
    setRecommendedLevel2(e.target.className)
  }

  function setLevel3(e) {
    e.preventDefault()
    document.getElementsByClassName('create-award-form__level')[2].innerHTML = e.target.className
    setRecommendedLevel3(e.target.className)
  }

  function setMastery(e) {
    setHasMastery(!hasMastery)
  }

  //Sends the information from the form to the backend to try and create an account
  //If the username is not unique returns an alert back to the user
  function submitForm(e) {
    e.preventDefault()
    let submit = true
    let details = []
    if (!hasMastery) {
      if (e.target[2].value == '' || e.target[3].value == '') {
        submit = false
      }
      details.push({'badge_requirements': e.target[2].value, 'results_description': e.target[3].value, 'recommended_level': level1, 'require_certification': e.target[4].checked})
    } else {
      if (e.target[2].value == '' || e.target[3].value == '') {
        submit = false
      }
      details.push({'badge_requirements': e.target[2].value, 'results_description': e.target[3].value, 'recommended_level': level1, 'require_certification': e.target[4].checked})
      if (e.target[5].value == '' || e.target[6].value == '') {
        submit = false
      }
      details.push({'badge_requirements': e.target[5].value, 'results_description': e.target[6].value, 'recommended_level': level2, 'require_certification': e.target[7].checked})
      if (e.target[8].value == '' || e.target[9].value == '') {
        submit = false
      }
      details.push({'badge_requirements': e.target[8].value, 'results_description': e.target[9].value, 'recommended_level': level3, 'require_certification': e.target[10].checked})
    }
    if (submit) {
      axios.post('/api/award/0/create_award', {
        badge_name: e.target[0].value,
        has_mastery: hasMastery,
        details: details
      })
      .then(resp => {
        if (resp.data != false) {
          alert("Award has been created, please refresh the page to update award list")
          e.target[0].value = ''
          e.target[1].checked = false
          setRecommendedLevel1('1')
          setRecommendedLevel2('1')
          setRecommendedLevel3('1')
        }
        else{
          alert("Badge with same name already exists, please check existing awards")
        }
      })
      .catch(resp => errorMessage(resp.response.statusText))
    }
    else {
      alert("Please fill in all fields first")
    }
  }

  return(
    <form className='create-award-form' onSubmit={ submitForm }>
      <label style={{fontSize: '30px'}}>Award Creation</label>
      <br/>
      <label>Badge name: </label>
      <input className='create-award-form__name'></input>
      <br/>
      <label>This badge has mastery levels: </label>
      <input className='create-award-form__mastery' type='checkbox' defaultChecked={true} onClick={setMastery}></input>
      <br/>
      {!hasMastery && <div>
        <label>Badge requirements (description of requirements): </label>
        <input className='create-award-form__requirements'></input>
        <br/>
        <label>Result descriptions (the description that should appear in the results for 32A form): </label>
        <input className='create-award-form__description'></input>
        <br/>
        <label>Recommended level for completion: Sec </label>
        <Popup className='award-level-popup' trigger={<label className='create-award-form__level'>1</label>} position="bottom">
          <p className='5' onClick={setLevel}>5</p>
          <p className='4' onClick={setLevel}>4</p>
          <p className='3' onClick={setLevel}>3</p>
          <p className='2' onClick={setLevel}>2</p>
          <p className='1' onClick={setLevel}>1</p>
        </Popup>
        <br/>
        <label>This badge requires awards certification: </label>
        <input className='create-award-form__certification' type='checkbox' defaultChecked={false}></input>
        <br/>
      </div>}
      {hasMastery && <div>
        <br/>
        <label style={{fontSize: '20px'}}>Basic</label>
        <br/>
        <label>Badge requirements (description of requirements): </label>
        <input className='create-award-form__requirements'></input>
        <br/>
        <label>Result descriptions (the description that should appear in the results for 32A form): </label>
        <input className='create-award-form__description'></input>
        <br/>
        <label>Recommended level for completion: Sec </label>
        <Popup className='award-level-popup' trigger={<label className='create-award-form__level'>1</label>} position="bottom">
          <p className='5' onClick={setLevel}>5</p>
          <p className='4' onClick={setLevel}>4</p>
          <p className='3' onClick={setLevel}>3</p>
          <p className='2' onClick={setLevel}>2</p>
          <p className='1' onClick={setLevel}>1</p>
        </Popup>
        <br/>
        <label>This badge requires awards certification: </label>
        <input className='create-award-form__certification' type='checkbox' defaultChecked={false}></input>
        <br/>
        <br/>
        <label style={{fontSize: '20px'}}>Advanced</label>
        <br/>
        <label>Badge requirements (description of requirements): </label>
        <input className='create-award-form__requirements'></input>
        <br/>
        <label>Result descriptions (the description that should appear in the results for 32A form): </label>
        <input className='create-award-form__description'></input>
        <br/>
        <label>Recommended level for completion: Sec </label>
        <Popup className='award-level-popup' trigger={<label className='create-award-form__level'>1</label>} position="bottom">
          <p className='5' onClick={setLevel2}>5</p>
          <p className='4' onClick={setLevel2}>4</p>
          <p className='3' onClick={setLevel2}>3</p>
          <p className='2' onClick={setLevel2}>2</p>
          <p className='1' onClick={setLevel2}>1</p>
        </Popup>
        <br/>
        <label>This badge requires awards certification: </label>
        <input className='create-award-form__certification' type='checkbox' defaultChecked={false}></input>
        <br/>
        <br/>
        <label style={{fontSize: '20px'}}>Master</label>
        <br/>
        <label>Badge requirements (description of requirements): </label>
        <input className='create-award-form__requirements'></input>
        <br/>
        <label>Result descriptions (the description that should appear in the results for 32A form): </label>
        <input className='create-award-form__description'></input>
        <br/>
        <label>Recommended level for completion: Sec </label>
        <Popup className='award-level-popup' trigger={<label className='create-award-form__level'>1</label>} position="bottom">
          <p className='5' onClick={setLevel3}>5</p>
          <p className='4' onClick={setLevel3}>4</p>
          <p className='3' onClick={setLevel3}>3</p>
          <p className='2' onClick={setLevel3}>2</p>
          <p className='1' onClick={setLevel3}>1</p>
        </Popup>
        <br/>
        <label>This badge requires awards certification: </label>
        <input className='create-award-form__certification' type='checkbox' defaultChecked={false}></input>
        <br/>
      </div>}
      <button>Create Award</button>
    </form>
  )
}

export { AwardCreationForm }