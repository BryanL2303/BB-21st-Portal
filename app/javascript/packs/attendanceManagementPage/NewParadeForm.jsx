import React, { useState, useEffect } from 'react'
import Popup from 'reactjs-popup'
import axios from 'axios'
import useCookies from '../general/useCookies'
import { handleServerError } from '../general/handleServerError'

// To access attendance records and take new attendance
const NewParadeForm = ({setReload}) => {
  const cookies = useCookies()
  const levels = ['1', '2', '3', '4/5']
  const [boyList, setBoyList] = useState([])
  const [primerList, setPrimerList] = useState([])
  const [officerList, setOfficerList] = useState([])
  const [companyAnnouncements, setCompanyAnnouncements] = useState([])
  const [platoonAnnouncements, setPlatoonAnnouncements] = useState({'1': [], '2': [], '3': [], '4/5': []})
  const [platoonPrograms, setPlatoonPrograms] = useState({'1': [], '2': [], '3': [], '4/5': []})
  const [paradeType, setParadeType] = useState("Parade")
  const [appointmentHolders, setAppointmentHolders] = useState({'dt': null, 'do': null, 'cos': null, 'flag_bearer': null, 'csm': null, 'ce': null})

  useEffect(() => {
    loadList()
  }, [])

  function loadList() {
    axios.post('/api/account/0/get_accounts_by_type', {
      account_type: "Boy"
    }, {
      withCredentials: true
    })
    .then(resp => {
      setBoyList(resp.data)
      resp.data.map((boy) => {
        if (boy.appointment == 'CSM') {
          document.getElementsByClassName('csm__name')[0].innerHTML = boy.account_name
          setAppointmentHolders((prev) => {
            prev['csm'] = boy.id
            return {...prev}
          })
        }
        if (boy.appointment == 'CE Sergeant') {
          document.getElementsByClassName('ce__name')[0].innerHTML = boy.account_name
          setAppointmentHolders((prev) => {
            prev['ce'] = boy.id
            return {...prev}
          })
        }
      })
    })
    .catch(resp => handleServerError(resp.response.status))
    axios.post('/api/account/0/get_accounts_by_type', {
        account_type: "Primer"
    }, {
      withCredentials: true
    })
    .then(resp => {
      setPrimerList(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
    axios.post('/api/account/0/get_accounts_by_type', {
      account_type: "Officer"
    }, {
      withCredentials: true
    })
    .then(resp => {
      setOfficerList(resp.data)
    })
    .catch(resp => handleServerError(resp.response.status))
  }

  function setDefaultDate(e) {
    let reportingTimeInput = document.getElementsByClassName('reporting-time-input')[0]
    reportingTimeInput.value = e.target.value + 'T08:30'
    let dismissalTimeInput = document.getElementsByClassName('dismissal-time-input')[0]
    dismissalTimeInput.value = e.target.value + 'T12:30'
    levels.map((level) => {
      document.getElementsByName('sec-' + level + '-start-time')[0].value = e.target.value + 'T08:30'
      document.getElementsByName('sec-' + level + '-end-time')[0].value = e.target.value + 'T12:30'
    })
    if (paradeType == 'Parade') {
      setCompanyAnnouncements([{announcement: 'All to bring PT Kit'}])
      setPlatoonPrograms({
        '1': [{start_time: e.target.value + 'T08:30', end_time: e.target.value + 'T08:45', program: 'Opening Parade'},
          {start_time: e.target.value + 'T08:45', end_time: e.target.value + 'T09:45', program: 'CE and Worship'},
          {start_time: e.target.value + 'T09:45', end_time: e.target.value + 'T11:00', program: 'Program 1'},
          {start_time: e.target.value + 'T11:00', end_time: e.target.value + 'T12:00', program: 'Program 2'},
          {start_time: e.target.value + 'T12:00', end_time: e.target.value + 'T12:15', program: 'Closing Parade'}
        ], 
        '2': [{start_time: e.target.value + 'T08:30', end_time: e.target.value + 'T08:45', program: 'Opening Parade'},
          {start_time: e.target.value + 'T08:45', end_time: e.target.value + 'T09:45', program: 'CE and Worship'},
          {start_time: e.target.value + 'T09:45', end_time: e.target.value + 'T11:00', program: 'Program 1'},
          {start_time: e.target.value + 'T11:00', end_time: e.target.value + 'T12:00', program: 'Program 2'},
          {start_time: e.target.value + 'T12:00', end_time: e.target.value + 'T12:15', program: 'Closing Parade'}], 
        '3': [{start_time: e.target.value + 'T08:30', end_time: e.target.value + 'T08:45', program: 'Opening Parade'},
          {start_time: e.target.value + 'T08:45', end_time: e.target.value + 'T09:45', program: 'CE and Worship'},
          {start_time: e.target.value + 'T09:45', end_time: e.target.value + 'T11:00', program: 'Program 1'},
          {start_time: e.target.value + 'T11:00', end_time: e.target.value + 'T12:00', program: 'Program 2'},
          {start_time: e.target.value + 'T12:00', end_time: e.target.value + 'T12:15', program: 'Closing Parade'}], 
        '4/5': []})
    }
  }

  function setParade(e) {
    document.getElementsByClassName('parade__type')[0].innerHTML = e.target.className
    setParadeType(e.target.className)
    if (paradeType != 'Parade') {
      setCompanyAnnouncements([])
      setPlatoonPrograms({'1': [], '2': [], '3': [], '4/5': []})
      setPlatoonAnnouncements({'1': [], '2': [], '3': [], '4/5': []})
    }
  }

  function setAccount(e, appointment) {
    document.getElementsByClassName(appointment + '__name')[0].innerHTML = e.target.className
    setAppointmentHolders((prev) => {
      prev[appointment] = e.target.id
      return {...prev}
    })
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
      console.log(appointmentHolders)
        axios.post('/api/parade/0/create_parade', {
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
          alert("Parade has been added!")
          setReload((prev) => !prev)
        })
        .catch(resp => handleServerError(resp.response.status))
    }
  }

  return(
    <form onSubmit={submitForm}>
        <label>Parade Type: </label>
        <Popup className='parade-type-popup' trigger={
            <label className={'parade__type'}>Parade</label>} position="bottom">
            <p className='Parade' onClick={setParade}>Parade</p>
            <p className='Camp' onClick={setParade}>Camp</p>
            <p className='Others' onClick={setParade}>Others</p>
        </Popup>
        <br/>

        <div className='flex-block'>
          <div className="half-block">
            <label>Date: </label>
            <input type='date' name='date' onChange={setDefaultDate}></input>
            <br/>
            <label>Venue: </label>
            <input name='venue' defaultValue='School, GMSS'></input>
            <br/>
            <label>Sec 1 Attire: </label>
            <input name='sec_1_attire'></input>
            <br/>
            <label>Sec 2 Attire: </label>
            <input name='sec_2_attire'></input>
            <br/>
            <label>Sec 3 Attire: </label>
            <input name='sec_3_attire'></input>
            <br/>
            <label>Sec 4/5 Attire: </label>
            <input name='sec_4_5_attire'></input>
            <br/>
            <label>Reporting Time: </label>
            <input name='reporting_time' className='reporting-time-input' type='datetime-local'></input>
            <br/>
            <label>Dismissal Time: </label>
            <input name='dismissal_time' className='dismissal-time-input' type='datetime-local'></input>
            <br/>
          </div>

          <div className="half-block">
            <label>Duty Teacher: </label>
            <Popup className='account-name-popup' trigger={
                <label className={'dt__name'}>-</label>} position="bottom">
                {officerList.map((officer) => {
                    return(<p key={officer.id} id={officer.id} className={officer.account_name} onClick={(e) => setAccount(e, 'dt')}>{officer.account_name}</p>)
                })}
            </Popup>
            <br/>
            <label>Duty Officer: </label>
            <Popup className='account-name-popup' trigger={
                <label className={'do__name'}>-</label>} position="bottom">
                {officerList.map((officer) => {
                    return(<p key={officer.id} id={officer.id} className={officer.account_name} onClick={(e) => setAccount(e, 'do')}>{officer.account_name}</p>)
                })}
                {primerList.map((primer) => {
                    return(<p key={primer.id} id={primer.id} className={primer.account_name} onClick={(e) => setAccount(e, 'do')}>{primer.account_name}</p>)
                })}
            </Popup>
            <br/>
            <label>COS: </label>
            <Popup className='account-name-popup' trigger={
                <label className={'cos__name'}>-</label>} position="bottom">
                {boyList.map((boy) => {
                    return(<p key={boy.id} id={boy.id} className={boy.account_name} onClick={(e) => setAccount(e, 'cos')}>{boy.account_name}</p>)
                })}
            </Popup>
            <br/>
            <label>Flag Bearer: </label>
            <Popup className='account-name-popup' trigger={
                <label className={'flag-bearer__name'}>-</label>} position="bottom">
                {boyList.map((boy) => {
                    return(<p key={boy.id} id={boy.id} className={boy.account_name} onClick={(e) => setAccount(e, 'flag-bearer')}>{boy.account_name}</p>)
                })}
            </Popup>
            <br/>
            <label>CSM: </label>
            <Popup className='account-name-popup' trigger={
                <label className={'csm__name'}>-</label>} position="bottom">
                {boyList.map((boy) => {
                    return(<p key={boy.id} id={boy.id} className={boy.account_name} onClick={(e) => setAccount(e, 'csm')}>{boy.account_name}</p>)
                })}
            </Popup>
            <br/>
            <label>CE: </label>
            <Popup className='account-name-popup' trigger={
                <label className={'ce__name'}>-</label>} position="bottom">
                {boyList.map((boy) => {
                    return(<p key={boy.id} id={boy.id} className={boy.account_name} onClick={(e) => setAccount(e, 'ce')}>{boy.account_name}</p>)
                })}
            </Popup>
          </div>
        </div>

        <br/>
        <label>Description: </label>
        <br/>
        <textarea name='description' placeholder='Remarks if any'></textarea>
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
                      <td width='13%'><input type='datetime-local' name={'sec-' + level + '-start-time'} /></td>-
                      <td width='13%'><input type='datetime-local' name={'sec-' + level + '-end-time'} /></td>
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
        <button>Add Parade</button>
    </form>
  )
}

export { NewParadeForm }