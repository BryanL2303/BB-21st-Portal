import React, { useState, useEffect } from 'react'
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'
import { AppointmentInformation } from './AppointmentInformation';

// To manage permissions for appointment holders
const AppointmentHoldersList = ({ account_type, accountAppointment, load, reLoad }) => {
  const [appointments, setAppointments] = useState([])
  const [appointmentHolders, setAppointmentHolders] = useState({})
  const [boyList, setBoyList] = useState([])
  const [primerList, setPrimerList] = useState([])
  const [officerList, setOfficerList] = useState([])
  const [accountType, setAccountType] = useState()
  const [accountId, setAccountId] = useState()

  useEffect(() => {
    retrieveAppointments()
    loadList()
    setAccountType()
    if (account_type == "Officer" || account_type == "Admin") {
        document.getElementsByClassName('create-appointment-form__name')[0].value = ""
        document.getElementsByClassName('create-appointment-form__type')[0].innerHTML = "Select Account Type"
        setAccountId()
    }
  }, [load])

  function loadList() {
    axios.post('/api/account/0/get_accounts_by_type', {
      account_type: "Boy"
    }, {
      withCredentials: true
    })
    .then(resp => {
      setBoyList(resp.data)
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

  // Should contact API for Appointments to get all appointments with their respective accounts
  // This should happen on render
  function retrieveAppointments() {
    axios.post("/api/appointment/0/get_appointments", {},
    {withCredentials: true})
    .then((resp) => {
        setAppointments(resp.data.appointments)
        setAppointmentHolders(resp.data.appointment_to_accounts)
        console.log(resp.data.appointments)
        console.log(resp.data.appointment_to_accounts)
    })
    .catch(resp => handleServerError(resp.response.status))
  }

  function setType(e) {
    e.preventDefault()
    document.getElementsByClassName('create-appointment-form__type')[0].innerHTML = e.target.className
    setAccountType(e.target.className)
    setAccountId()
  }

  function setAccount(e) {
    e.preventDefault()
    document.getElementsByClassName('create-appointment__account')[0].innerHTML = e.target.className
    setAccountId(e.target.id)
  }

  // On button click should send information to API to create a new appointment with respective account
  function createAppointment(e) {
    e.preventDefault()
    let appointmentName = e.target[0].value
    if (appointmentName != '' && accountType != null && accountId != null) {
        axios.post("/api/appointment/0/create_appointment", {
            appointment_name: appointmentName,
            account_id: accountId,
            account_type: accountType
        },
        {withCredentials: true})
        .then(() => reLoad())
        .catch(resp => handleServerError(resp.response.status))
    } else {
        alert("Please fill in all fields first.")
    }
  }

  return(
    <div className='appointment-holders-list'>
      <label style={{fontSize: '30px'}}>Appointment Holders</label>
      <br/>
      {appointments.map((appointment) => 
        <AppointmentInformation accountType={account_type} accountAppointment={accountAppointment} key={appointment.id} appointment={appointment} appointmentHolders={appointmentHolders}
         boyList={boyList} primerList={primerList} officerList={officerList}/>
      )}
      {(account_type == "Officer" || account_type == "Admin") &&
       <label style={{fontSize: '30px'}}>Add Appointment</label>
      }
      {(account_type == "Officer" || account_type == "Admin") &&
       <form onSubmit={createAppointment}>
        <label>Appointment Name: </label>
        <input className='create-appointment-form__name'></input>
        <br/>
        <label>Account Type: </label>
        <Popup className='account-type-popup' trigger={<label className='create-appointment-form__type'>
            Select Account Type</label>} position="bottom">
            <p className='Officer' onClick={setType}>Officer</p>
            <p className='Primer' onClick={setType}>Primer</p>
            <p className='Boy' onClick={setType}>Boy</p>
        </Popup>
        <br/>
        <label>Current Appointment Holder: </label>
        {accountType == "Officer" &&
            <Popup className='account-name-popup' trigger={<label className='create-appointment__account'>
                Select Appointment Holder</label>} position="bottom">
                {officerList.map((officer) => {
                  return(
                    <p key={officer.id} id={officer.id} className={officer.account_name} onClick={setAccount}>{officer.account_name}</p>
                  )
                })}
            </Popup>}
        {accountType == "Primer" &&
            <Popup className='account-name-popup' trigger={<label className='create-appointment__account'>
                Select Appointment Holder</label>} position="bottom">
                {primerList.map((primer) => {
                  return(
                    <p key={primer.id} id={primer.id} className={primer.account_name} onClick={setAccount}>{primer.account_name}</p>
                  )
                })}
            </Popup>}
        {accountType == "Boy" &&
            <Popup className='account-name-popup' trigger={<label className='create-appointment__account'>
                Select Appointment Holder</label>} position="bottom">
                {boyList.map((boy) => {
                    return(<p key={boy.id} id={boy.id} className={boy.account_name} onClick={setAccount}>{boy.account_name}</p>)
                })}
            </Popup>}
        <button>Add New Appointment</button>
      </form>}
    </div>
  )
}

AppointmentHoldersList.propTypes = {
  account_type: PropTypes.string,
  accountAppointment: PropTypes.string,
  load: PropTypes.bool.isRequired,
  reLoad: PropTypes.func.isRequired
}

export { AppointmentHoldersList }