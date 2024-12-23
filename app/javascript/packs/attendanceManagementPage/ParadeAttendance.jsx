import React, { useState, useEffect } from 'react'
import Popup from 'reactjs-popup'
import axios from 'axios'
import PropTypes from 'prop-types'
import useCookies from '../general/useCookies'
import { handleServerError } from '../general/handleServerError'

// To access attendance records and take new attendance
const ParadeAttendance = ({parade, boys, primers, officers, setReload}) => {
  const cookies = useCookies()
  const [paradeAppointment, setParadeAppointment] = useState()
  const [takingAttendance, setTakingAttendance] = useState(false)
  const [currentAttendance, setCurrentAttendance] = useState(parade.parade_attendance)
  const levels = ['1', '2', '3', '4/5']

  useEffect(() => {
    setCurrentAttendance(parade.parade_attendance)
    const paradeDate = new Date(parade.info.date); // Convert the string to a Date object
    const currentYear = new Date().getFullYear(); // Get the current year

    if (
      (paradeDate.getFullYear() === currentYear) &&
      ((cookies.get("Appointment")?.includes("Platoon Sergeant") && !parade.info.cos_finalized &&
        !parade.info.csm_finalized && !parade.info.do_finalized && !parade.info.captain_finalized) ||
      (cookies.get("Name") == parade.cos?.account_name &&
        !parade.info.csm_finalized && !parade.info.do_finalized && !parade.info.captain_finalized) ||
      ((cookies.get("Name") == parade.csm?.account_name || cookies.get("Appointment")?.includes("CSM")) && !parade.info.do_finalized && !parade.info.captain_finalized) ||
      (cookies.get("Name") == parade.do?.account_name && !parade.info.captain_finalized) ||
      (cookies.get("Appointment") == 'Captain' && !parade.info.captain_finalized))
      ) {
        setTakingAttendance(true)
    } else {
      setTakingAttendance(false)
    }
    if (cookies.get("Name") == parade.cos?.account_name) setParadeAppointment('cos')
    else if ((cookies.get("Name") == parade.csm?.account_name || cookies.get("Appointment")?.includes("CSM"))) setParadeAppointment('csm')
    else if (cookies.get("Appointment") == 'Captain') setParadeAppointment('captain')
    else if (cookies.get("Name") == parade.do?.account_name) setParadeAppointment('do')
  }, [parade])

  function setAttendance(attendance, account_id, level) {
    axios.post('/api/parade/' + parade.info.id + '/update_attendance', {
      parade_appointment: paradeAppointment,
      account_id: account_id,
      level: level,
      old_attendance: currentAttendance[account_id]?.attendance || null,
      new_attendance: attendance
    }, {
      withCredentials: true
    })
    .then((resp) => {
      if (resp.status == 308) {
        alert("It seems that one of the parade appointment holders has already finalized the attendance. Please approach the person who did so if further changes are necessary.")
      } else if (resp.status == 304) {
        alert("It seems that someone else has updated the attendance for this person differently than what you indicated, please check again before retrying!")
      } else if (resp.status == 200) {
        setCurrentAttendance(resp.data)
      }
    })
    .catch(resp => handleServerError(resp.response.status))
  }

  function sendFinalizeAttendance(finalized) {
    axios.post('/api/parade/' + parade.info.id + '/update_finalize', {
      parade_appointment: paradeAppointment,
      finalized: finalized
    }, {
      withCredentials: true
    })
    .then(() => {
      setReload((prev) => {
        return !prev
      })
    })
    .catch(resp => handleServerError(resp.response.status))
  }

  return(
    <div className='parade-attendance'>
      <div className="flex-block" style={{borderBottom: 'solid'}}>
        
        {levels.map((level) => {
          return(
            <div key={level} className="half-block">
              <h3>Sec {level} Attendance:</h3>
              <table width='90%'>
                <tbody width='100%'>
                  {boys.map((boy) => {
                    if (boy.level == level && 
                      ((!takingAttendance && boy.id in currentAttendance) ||
                      (takingAttendance && boy.roll_call))) {
                      return(<tr key={boy.id} width='100%'>
                        <td width='80%'>{boy.rank} {boy.account_name}</td>
                        {!takingAttendance && <td><label>{currentAttendance[boy.id]?.attendance || '\u00A0'}</label></td>}
                        {takingAttendance &&
                          <td width='20%'>
                            <Popup className='account-attendance-popup'
                              trigger={<label style={{display: 'inline-block', height: '100%', width: '100%'}}>{currentAttendance[boy.id]?.attendance || '\u00A0'}</label>}
                              position="bottom"
                            >
                              <p onClick={() => setAttendance(null, boy.id, boy.level)}>-</p>
                              <p onClick={() => setAttendance('1', boy.id, boy.level)}>1</p>
                              <p onClick={() => setAttendance('S', boy.id, boy.level)}>S</p>
                              <p onClick={() => setAttendance('E', boy.id, boy.level)}>E</p>
                              <p onClick={() => setAttendance('0', boy.id, boy.level)}>0</p>
                            </Popup>
                          </td>}
                      </tr>)
                    }
                  })}
                </tbody>
              </table>
            </div>
          )
        })}
        
        <div className="half-block">
          <h3>Primers Attendance:</h3>
          <table width='90%'>
            <tbody width='100%'>
              {primers.map((primer) => {
                if ((!takingAttendance && primer.id in currentAttendance) ||
                (takingAttendance && primer.roll_call)) {
                  return(<tr key={primer.id} width='100%'>
                    <td width='80%'>{primer.rank} {primer.account_name}</td>
                    {!takingAttendance && <td><label>{currentAttendance[primer.id]?.attendance || '\u00A0'}</label></td>}
                    {takingAttendance &&
                      <td width='20%'>
                        <Popup className='account-attendance-popup'
                          trigger={<label style={{display: 'inline-block', height: '100%', width: '100%'}}>{currentAttendance[primer.id]?.attendance || '\u00A0'}</label>}
                          position="bottom"
                        >
                          <p onClick={() => setAttendance(null, primer.id)}>-</p>
                          <p onClick={() => setAttendance('1', primer.id)}>1</p>
                          <p onClick={() => setAttendance('S', primer.id)}>S</p>
                          <p onClick={() => setAttendance('E', primer.id)}>E</p>
                          <p onClick={() => setAttendance('0', primer.id)}>0</p>
                        </Popup>
                      </td>}
                  </tr>)
                }
              })}
            </tbody>
          </table>
        </div>
        
        <div className="half-block">
          <h3>Officers / VALs Attendance:</h3>
          <table width='90%'>
            <tbody width='100%'>
              {officers.map((officer) => {
                if ((!takingAttendance && officer.id in currentAttendance) ||
                (takingAttendance && officer.roll_call)) {
                  return(<tr key={officer.id} width='100%'>
                    <td width='80%'>{officer.rank!= 'Teacher'? officer.rank : officer.honorifics} {officer.account_name}</td>
                    {!takingAttendance && <td><label>{currentAttendance[officer.id]?.attendance || '\u00A0'}</label></td>}
                    {takingAttendance &&
                      <td width='20%'>
                        <Popup className='account-attendance-popup'
                          trigger={<label style={{display: 'inline-block', height: '100%', width: '100%'}}>{currentAttendance[officer.id]?.attendance || '\u00A0'}</label>}
                          position="bottom"
                        >
                          <p onClick={() => setAttendance(null, officer.id)}>-</p>
                          <p onClick={() => setAttendance('1', officer.id)}>1</p>
                          <p onClick={() => setAttendance('S', officer.id)}>S</p>
                          <p onClick={() => setAttendance('E', officer.id)}>E</p>
                          <p onClick={() => setAttendance('0', officer.id)}>0</p>
                        </Popup>
                      </td>}
                  </tr>)
                }
              })}
            </tbody>
          </table>
        </div>
      </div>

      {parade.info.cos_finalized && <h4 style={{width: '100%'}}>COS Finalized</h4>}
      {parade.info.csm_finalized && <h4 style={{width: '100%'}}>CSM Finalized</h4>}
      {parade.info.do_finalized && <h4 style={{width: '100%'}}>DO Finalized</h4>}
      {parade.info.captain_finalized && <h4 style={{width: '100%'}}>Captain Finalized</h4>}

      {paradeAppointment == 'cos' && !parade.info.cos_finalized &&
        <button onClick={() => sendFinalizeAttendance(true)}>Finalize Attendance</button>}
      {paradeAppointment == 'cos' && parade.info.cos_finalized &&
        <button onClick={() => sendFinalizeAttendance(false)}>Unfinalize Attendance</button>}
      {paradeAppointment == 'csm' && !parade.info.csm_finalized &&
        <button onClick={() => sendFinalizeAttendance(true)}>Finalize Attendance</button>}
      {paradeAppointment == 'csm' && parade.info.csm_finalized &&
        <button onClick={() => sendFinalizeAttendance(false)}>Unfinalize Attendance</button>}
      {paradeAppointment == 'do' && !parade.info.do_finalized &&
        <button onClick={() => sendFinalizeAttendance(true)}>Finalize Attendance</button>}
      {paradeAppointment == 'do' && parade.info.do_finalized &&
        <button onClick={() => sendFinalizeAttendance(false)}>Unfinalize Attendance</button>}
      {paradeAppointment == 'captain' && !parade.info.captain_finalized &&
        <button onClick={() => sendFinalizeAttendance(true)}>Finalize Attendance</button>}
      {paradeAppointment == 'captain' && parade.info.captain_finalized &&
        <button onClick={() => sendFinalizeAttendance(false)}>Unfinalize Attendance</button>}
    </div>
  )
}

ParadeAttendance.propTypes = {
  id: PropTypes.number.isRequired,  
  setPageState: PropTypes.func.isRequired,
  reload: PropTypes.bool.isRequired,
  setReload: PropTypes.func.isRequired,
  boys: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    account_name: PropTypes.string,
  })),
  primers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    account_name: PropTypes.string,
  })),
  officers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    account_name: PropTypes.string,
  })),
  parade: PropTypes.shape({
    info: PropTypes.shape({
      id: PropTypes.string,
      date: PropTypes.string,
      cos_finalized: PropTypes.bool,
      csm_finalized: PropTypes.bool,
      do_finalized: PropTypes.bool,
      captain_finalized: PropTypes.bool,
    }),
    parade_attendance: PropTypes.arrayOf(),
    cos: PropTypes.shape({
      account_name: PropTypes.string,
    }),
    csm: PropTypes.shape({
      account_name: PropTypes.string,
    }),
    do: PropTypes.shape({
      account_name: PropTypes.string,
    }),
  }),
}

export { ParadeAttendance }