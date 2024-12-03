import React, { useState, useEffect } from 'react'
import Popup from 'reactjs-popup'
import axios from 'axios'
import useCookies from '../general/useCookies'
import { handleServerError } from '../general/handleServerError'

// To access attendance records and take new attendance
const ParadeEditor = ({parade, boys, primers, officers, setReload, setPageState}) => {
  const cookies = useCookies()
  const levels = ['1', '2', '3', '4/5']
  const [companyAnnouncements, setCompanyAnnouncements] = useState(parade.company_announcements)
  const [platoonAnnouncements, setPlatoonAnnouncements] = useState(parade.platoon_announcements)
  const [platoonPrograms, setPlatoonPrograms] = useState(parade.platoon_programs)
  let paradeType = parade.info.parade_type
  let appointmentHolders = {'dt': parade.info.dt_id, 'do': parade.info.do_id, 'cos': parade.info.cos_id,
    'flag_bearer': parade.info.flag_bearer_id, 'csm': parade.info.csm_id, 'ce': parade.info.ce_id}

  useEffect(() => {
    Object.keys(appointmentHolders).map((key) => {
      boys.map((boy) => {
        if (boy.id == appointmentHolders[key]) {
          document.getElementsByClassName(key + '__name')[0].innerHTML = boy.account_name
        }
      })
      primers.map((primer) => {
        if (primer.id == appointmentHolders[key]) {
          document.getElementsByClassName(key + '__name')[0].innerHTML = primer.account_name
        }
      })
      officers.map((officer) => {
        if (officer.id == appointmentHolders[key]) {
          document.getElementsByClassName(key + '__name')[0].innerHTML = officer.account_name
        }
      })
    })
  }, [])

  function setDefaultDate(e) {
    let reportingTimeInput = document.getElementsByClassName('reporting-time-input')[0]
    reportingTimeInput.value = e.target.value + 'T08:30'
    let dismissalTimeInput = document.getElementsByClassName('dismissal-time-input')[0]
    dismissalTimeInput.value = e.target.value + 'T12:30'
    levels.map((level) => {
      document.getElementsByName('sec-' + level + '-start-time')[0].value = e.target.value + 'T00:00'
      document.getElementsByName('sec-' + level + '-end-time')[0].value = e.target.value + 'T00:00'
    })
  }

  function setParadeType(e) {
    document.getElementsByClassName('parade__type')[0].innerHTML = e.target.className
    paradeType = e.target.className
  }

  function setAccount(e, appointment) {
    document.getElementsByClassName(appointment + '__name')[0].innerHTML = e.target.className
    appointmentHolders[appointment] = e.target.id
  }

  function addCompanyAnnouncement() {
    let newAnnouncement = document.getElementsByName('new-company-announcement')[0].value
    if (newAnnouncement != '') {
      setCompanyAnnouncements((prev) => {
        return [...prev, {announcement: newAnnouncement}]
      })
    } else {
      alert("The company announcement cannot be empty!")
    }
  }

  function updateCompanyAnnouncement(e, index) {
    setCompanyAnnouncements((prev) => {
      prev[index].announcement = e.target.value
      return [...prev]
    })
  }

  function deleteCompanyAnnouncement(index) {
    setCompanyAnnouncements((prev) => {
      prev.splice(index, 1)
      return [...prev]
    })
  }

  function addPlatoonProgram(level) {
    let newProgram = document.getElementsByName('sec-' + level + '-program')[0].value
    let newStartTime = document.getElementsByName('sec-' + level + '-start-time')[0].value
    let newEndTime = document.getElementsByName('sec-' + level + '-end-time')[0].value
    if (newProgram != '') {
      setPlatoonPrograms((prev) => {
        prev[level] = [...prev[level], {start_time: newStartTime, end_time: newEndTime, program: newProgram}]
        return {...prev}
      })
    } else {
      alert("Please fill in all the fields!")
    }
  }

  function updatePlatoonProgram(e, level, index, column) {
    setPlatoonPrograms((prev) => {
      prev[level][index][column] = e.target.value
      return {...prev}
    })
  }

  function deletePlatoonProgram(level, index) {
    setPlatoonPrograms((prev) => {
      prev[level].splice(index, 1)
      return {...prev}
    })
  }

  function addPlatoonAnnouncement(level) {
    let newAnnouncement = document.getElementsByName('sec-' + level + '-announcement')[0].value
    if (newAnnouncement != '') {
      setPlatoonAnnouncements((prev) => {
        prev[level] = [...prev[level], {announcement: newAnnouncement}]
        return {...prev}
      })
    } else {
      alert("The platoon announcement cannot be empty!")
    }
  }

  function updatePlatoonAnnouncement(e, level, index) {
    setPlatoonAnnouncements((prev) => {
      prev[level][index].announcement = e.target.value
      return [...prev]
    })
  }

  function deletePlatoonAnnouncement(level, index) {
    setPlatoonAnnouncements((prev) => {
      prev[level].splice(index, 1)
      return {...prev}
    })
  }

  function submitForm(e) {
    e.preventDefault()
    let submit = true
    if (e.target.elements['date'].value == "") {
        submit = false
    }
    if (submit) {
        axios.post('/api/parade/' + parade.info.id + '/edit_parade', {
            parade_type: paradeType,
            date: e.target.elements['date'].value,
            venue: e.target.elements['venue'].value,
            sec_1_attire: e.target.elements['sec_1_attire'].value,
            sec_2_attire: e.target.elements['sec_2_attire'].value,
            sec_3_attire: e.target.elements['sec_3_attire'].value,
            sec_4_5_attire: e.target.elements['sec_4_5_attire'].value,
            reporting_time: e.target.elements['reporting_time'].value,
            dismissal_time: e.target.elements['dismissal_time'].value,
            dt_id: appointmentHolders['dt'],
            do_id: appointmentHolders['do'],
            cos_id: appointmentHolders['cos'],
            flag_bearer_id: appointmentHolders['flag_bearer'],
            csm_id: appointmentHolders['csm'],
            ce_id: appointmentHolders['ce'],
            description: e.target.elements['description'].value,
            company_announcements: companyAnnouncements,
            platoon_programs: platoonPrograms,
            platoon_announcements: platoonAnnouncements
        })
        .then(() => {
          alert("Changes has been saved!")
          setReload((prev) => {
            return !prev
          })
        })
        .catch(resp => handleServerError(resp.response.status))
    }
  }

  function deleteParade(e) {
    if (window.confirm("Deleting the parade will also remove all other information related to it such as attendance taken.\nAre you sure you want to proceed?")) {
      axios.post('/api/parade/' + parade.info.id + '/delete_parade', {})
      .then(() => {
        setReload((prev) => {
          return !prev
        })
        alert("Parade has been deleted!")
        setPageState('list')
      })
      .catch(resp => handleServerError(resp.response.status))
    }
  }

  return(
    <form className='parade-editor' onSubmit={submitForm}>
        <label>Parade Type: </label>
        <Popup className='parade-type-popup' trigger={
            <label className={'parade__type'}>{parade.info.parade_type}</label>} position="bottom">
            <p className='Parade' onClick={setParadeType}>Parade</p>
            <p className='Camp' onClick={setParadeType}>Camp</p>
            <p className='Others' onClick={setParadeType}>Others</p>
        </Popup>
        <br/>
        <div className='flex-block'>
          <div className="half-block">
            <label>Date: </label>
            <input type='date' name='date' defaultValue={parade.info.date.split('T')[0]} onChange={setDefaultDate} />
            <br/>
            <label>Venue: </label>
            <input name='venue' defaultValue={parade.info.venue}></input>
            <br/>
            <label>Sec 1 Attire: </label>
            <input name='sec_1_attire' defaultValue={parade.info.sec_1_attire}></input>
            <br/>
            <label>Sec 2 Attire: </label>
            <input name='sec_2_attire' defaultValue={parade.info.sec_2_attire}></input>
            <br/>
            <label>Sec 3 Attire: </label>
            <input name='sec_3_attire' defaultValue={parade.info.sec_3_attire}></input>
            <br/>
            <label>Sec 4/5 Attire: </label>
            <input name='sec_4_5_attire' defaultValue={parade.info.sec_4_5_attire}></input>
            <br/>
            <label>Reporting Time: </label>
            <input name='reporting_time' className='reporting-time-input' type='datetime-local' defaultValue={parade.info.reporting_time.slice(0, 16)}></input>
            <br/>
            <label>Dismissal Time: </label>
            <input name='dismissal_time' className='dismissal-time-input' type='datetime-local' defaultValue={parade.info.dismissal_time.slice(0, 16)}></input>
            <br/>
          </div>

          <div className="half-block">
          <label>Duty Teacher: </label>
          <Popup className='account-name-popup' trigger={
              <label className={'dt__name'}>-</label>} position="bottom">
              {officers.map((officer) => {
                if (officer.rank == 'Teacher') {
                  return(<p key={officer.id} id={officer.id} className={officer.account_name} onClick={(e) => setAccount(e, 'dt')}>{officer.account_name}</p>)
                }
              })}
          </Popup>
          <br/>
          <label>Duty Officer: </label>
          <Popup className='account-name-popup' trigger={
              <label className={'do__name'}>-</label>} position="bottom">
              {officers.map((officer) => {
                return(<p key={officer.id} id={officer.id} className={officer.account_name} onClick={(e) => setAccount(e, 'do')}>{officer.account_name}</p>)
              })}
              {primers.map((primer) => {
                  return(<p key={primer.id} id={primer.id} className={primer.account_name} onClick={(e) => setAccount(e, 'do')}>{primer.account_name}</p>)
              })}
          </Popup>
          <br/>
          <label>COS: </label>
          <Popup className='account-name-popup' trigger={
              <label className={'cos__name'}>-</label>} position="bottom">
              {boys.map((boy) => {
                  return(<p key={boy.id} id={boy.id} className={boy.account_name} onClick={(e) => setAccount(e, 'cos')}>{boy.account_name}</p>)
              })}
          </Popup>
          <br/>
          <label>Flag Bearer: </label>
          <Popup className='account-name-popup' trigger={
              <label className={'flag_bearer__name'}>-</label>} position="bottom">
              {boys.map((boy) => {
                  return(<p key={boy.id} id={boy.id} className={boy.account_name} onClick={(e) => setAccount(e, 'flag_bearer')}>{boy.account_name}</p>)
              })}
          </Popup>
          <br/>
          <label>CSM: </label>
          <Popup className='account-name-popup' trigger={
              <label className={'csm__name'}>-</label>} position="bottom">
              {boys.map((boy) => {
                  return(<p key={boy.id} id={boy.id} className={boy.account_name} onClick={(e) => setAccount(e, 'csm')}>{boy.account_name}</p>)
              })}
          </Popup>
          <br/>
          <label>CE: </label>
          <Popup className='account-name-popup' trigger={
              <label className={'ce__name'}>-</label>} position="bottom">
              {boys.map((boy) => {
                  return(<p key={boy.id} id={boy.id} className={boy.account_name} onClick={(e) => setAccount(e, 'ce')}>{boy.account_name}</p>)
              })}
          </Popup>
          </div>
        </div>
        <br/>
        <label>Description: </label>
        <br/>
        <textarea name='description' defaultValue={parade.info.description}></textarea>
        <br/>
        <br/>
        <h3>Company Announcements:</h3>
        <table width='100%'>
          <tbody width='100%'>
            {companyAnnouncements.map((announcement, index) => {
              return(
                <tr key={index} width='100%'>
                  <td width='3%'><label>{index + 1}. </label></td>
                  <td width='82%'><input defaultValue={announcement.announcement} onBlur={(e) => {updateCompanyAnnouncement(e, index)}} /></td>
                  <td width='15%'><button type='button' onClick={() => deleteCompanyAnnouncement(index)}>X</button></td>
                </tr>
              )
            })}
            <tr width='100%'>
              <td width='85%' colSpan={2}><input name='new-company-announcement'></input></td>
              <td width='15%' colSpan={2}><button type='button' onClick={addCompanyAnnouncement}>Add Announcement</button></td>
            </tr>
          </tbody>
        </table>
        <br/>
        <div>
          {levels.map((level) => {
            return(
              <div key={level}>
                <h3>Sec {level} Programs:</h3>
                <table width='100%'>
                  <tbody width='100%'>
                    {platoonPrograms[level].map((program, index) => {
                      return(
                        <tr key={index} width='100%'>
                          <td width='13%'><input type='datetime-local' defaultValue={program.start_time.slice(0, 16)} onBlur={(e) => {updatePlatoonProgram(e, level, index, 'start_time')}} /></td>-
                          <td width='13%'><input type='datetime-local' defaultValue={program.end_time.slice(0, 16)} onBlur={(e) => {updatePlatoonProgram(e, level, index, 'end_time')}} /></td>
                          <td width='65%'><input defaultValue={program.program} onBlur={(e) => {updatePlatoonProgram(e, level, index, 'program')}} /></td>
                          <td width='5%'><button type='button' onClick={() => deletePlatoonProgram(level, index)}>X</button></td>
                        </tr>
                      )
                    })}
                    <tr width='100%'>
                      <td width='13%'><input type='datetime-local' name={'sec-' + level + '-start-time'} defaultValue={parade.info.reporting_time.slice(0, 16)} /></td>-
                      <td width='13%'><input type='datetime-local' name={'sec-' + level + '-end-time'} defaultValue={parade.info.dismissal_time.slice(0, 16)} /></td>
                      <td width='65%'><input name={'sec-' + level + '-program'}></input></td>
                      <td width='5%'><button type='button' onClick={() => addPlatoonProgram(level)}>Add Program</button></td>
                    </tr>
                  </tbody>
                </table>
                <h3>Platoon Announcements:</h3>
                <table width='100%'>
                  <tbody width='100%'>
                    {platoonAnnouncements[level].map((announcement, index) => {
                      return(
                        <tr key={index} width='100%'>
                          <td width='3%'><label>{index + 1}. </label></td>
                          <td width='82%'><input defaultValue={announcement.announcement} onBlur={(e) => {updatePlatoonAnnouncement(e, level, index)}} /></td>
                          <td width='15%'><button type='button' onClick={() => deletePlatoonAnnouncement(level, index)}>X</button></td>
                        </tr>
                      )
                    })}
                    <tr width='100%'>
                      <td width='85%' colSpan={2}><input name={'sec-' + level + '-announcement'}></input></td>
                      <td width='15%' colSpan={2}><button type='button' onClick={() => addPlatoonAnnouncement(level)}>Add Announcement</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
        <br/>
        <button>Save Changes</button>
        <button type='button' onClick={deleteParade}>Delete Parade</button>
    </form>
  )
}

export { ParadeEditor }