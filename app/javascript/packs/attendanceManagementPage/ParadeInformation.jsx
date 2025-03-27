import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { handleServerError } from '../general/handleServerError'
import { ParadeNoticePDF } from './ParadeNoticePDF'
import { ParadeAttendance } from './ParadeAttendance'
import { ParadeEditor } from './ParadeEditor'

// To access attendance records and take new attendance
const ParadeInformation = ({accountType, appointment, id, setPageState, reload, setReload}) => {
  const [render, setRender] = useState(false)
  const [showParadeNotice, setShowParadeNotice] = useState(true)
  const [showParadeEditor, setShowParadeEditor] = useState(false)
  const [parade, setParade] = useState({})
  const [boys, setBoys] = useState([])
  const [primers, setPrimers] = useState([])
  const [officers, setOfficers] = useState([])

  useEffect(() => {
    axios.post('/api/parade/' + id + '/get_parade', {},
    {withCredentials: true})
    .then((resp) => {
      setParade(resp.data)
      setRender(true)
    })
    .catch(resp => handleServerError(resp.response.status))
    axios.post('/api/account/0/get_accounts_by_type', {
      account_type: "Boy"
    }, {
      withCredentials: true
    })
    .then(resp => {setBoys(resp.data)})
    .catch(resp => handleServerError(resp.response.status))
    axios.post('/api/account/0/get_accounts_by_type', {
      account_type: "Primer"
    }, {
      withCredentials: true
    })
    .then(resp => {setPrimers(resp.data)})
    .catch(resp => handleServerError(resp.response.status))
    axios.post('/api/account/0/get_accounts_by_type', {
      account_type: "Officer"
    }, {
      withCredentials: true
    })
    .then(resp => {setOfficers(resp.data)})
    .catch(resp => handleServerError(resp.response.status))
  }, [id, reload])

  function toggleParadeNotice() {
    setShowParadeNotice((prev) => {
      if (!prev) {
        setShowParadeEditor(false)
        return true
      } else {
        return false
      }
    })
  }

  function toggleEditor() {
    setShowParadeEditor((prev) => {
      if (prev == false) {
        setShowParadeNotice(false)
        return true
      } else {
        return false
      }
    })
  }

  if (!render) return null

  return(
    <div className='parade-information'>
      <div>
        {!showParadeNotice && <button onClick={toggleParadeNotice} aria-label='Show Parade Notice' name='show-parade-notice'>Show Parade Notice</button>}
        {showParadeNotice && <button onClick={toggleParadeNotice} aria-label='Hide Parade Notice' name='hide-parade-notice'>Hide Parade Notice</button>}

        {(['Admin', 'Officer', 'Primer'].includes(accountType) || ['CSM', 'DY CSM', 'Admin Sergeant'].includes(appointment)) && (
          <button onClick={toggleEditor} name='edit-parade-notice'>Edit Parade Notice</button>
        )}
      </div>

      {showParadeNotice && <ParadeNoticePDF parade={parade} />}
      {showParadeEditor && <ParadeEditor parade={parade} boys={boys} primers={primers} officers={officers} setReload={setReload} setPageState={setPageState}/>}

      <ParadeAttendance parade={parade} boys={boys} primers={primers} officers={officers} setReload={setReload} />
    </div>
  )
}

ParadeInformation.propTypes = {
  id: PropTypes.number.isRequired,  
  setPageState: PropTypes.func.isRequired,
  reload: PropTypes.bool.isRequired,
  setReload: PropTypes.func.isRequired
}

export { ParadeInformation }