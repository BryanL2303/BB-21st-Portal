import React, { useState } from 'react'
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// To manage permissions for appointment holders
const AppointmentInformation = ({ accountType, accountAppointment, appointment, appointmentHolders, boyList, primerList, officerList }) => {
  const coreAppointments = ['Captain', 'CSM', 'DY CSM', 'Sec 4/5 PS', 'Sec 3 PS', 'Sec 2 PS', 'Sec 1 PS']
  const [accountId, setAccountId] = useState()

  function setAccount(e) {
    e.preventDefault()
    document.getElementsByClassName('update-' +appointment.appointment_name +'__name')[0].innerHTML = e.target.className
    setAccountId(e.target.id)
  }

  // To change accounts for existing appointment
  function updateAppointmentHolder(e) {
    e.preventDefault()
    if (accountId != appointmentHolders[appointment.id]['id'] && accountId != null) {
        axios.post("/api/appointment/" + e.target.id + "/update_appointment", {
            account_id: accountId
        },
        {withCredentials: true})
        .then(alert("Appointment holder has been updated."))
        .catch(resp => handleServerError(resp.response.status))
    } else {
        alert("The current selected account is already the appointment holder.")
    }
  }

  // On button click should send appointment_id to API to delete
  // This should only be possible for non core appointments
  function deleteAppointment(e) {
    e.preventDefault()
    axios.post("/api/appointment/" + e.target.className + "/delete_appointment", {},
    {withCredentials: true})
    .then(alert("Appointment has been removed."))
    .catch(resp => handleServerError(resp.response.status))
  }

  return(
    <div className='appointment-holder-information'>
        <label>{appointment.appointment_name}: </label>
        {(accountType == "Officer" || accountType == "Admin") &&
          <Popup currentStyle={{maxHeight: '5vh', overscrollY: 'auto'}} className='account-name-popup' trigger={
          <label className={'update-' + appointment.appointment_name + '__name'}>
            {appointmentHolders[appointment.id]['account_name']}</label>} position="bottom">
            {appointment.account_type == 'Officer' && officerList.map((officer) => {
                return(<p key={officer.id} id={officer.id} className={officer.account_name} onClick={setAccount}>{officer.account_name}</p>)
            })}
            {appointment.account_type == 'Primer' && primerList.map((primer) => {
                return(<p key={primer.id} id={primer.id} className={primer.account_name} onClick={setAccount}>{primer.account_name}</p>)
            })}
            {appointment.account_type == 'Boy' && boyList.map((boy) => {
                return(<p key={boy.id} id={boy.id} className={boy.account_name} onClick={setAccount}>{boy.account_name}</p>)
            })}
          </Popup>}
        {accountType != "Officer" && accountType != "Admin" &&
            <label>{appointmentHolders[appointment.id]['account_name']}</label>
        }
        {(accountType == "Officer" || accountType == "Admin") &&
            <button id={appointment.id} className={appointment.appointment_name} onClick={updateAppointmentHolder}>
                Update Appointment Holder</button>
        }
        {(accountType == "Officer" || accountType == "Admin") &&
            !(coreAppointments.includes(appointment.appointment_name)) &&
                <button className={appointment.id} onClick={deleteAppointment}>Remove Appointment</button>
        }
        <br/>
    </div>
  )
}

AppointmentInformation.propTypes = {
  accountType: PropTypes.string,
  accountAppointment: PropTypes.string,
  appointment: PropTypes.shape({
    id: PropTypes.number,
    appointment_name: PropTypes.string,
    account_type: PropTypes.string,
    account_id: PropTypes.number
  }),
  appointmentHolders: PropTypes.shape({
    account: PropTypes.shape({
        id: PropTypes.number,
        account_name: PropTypes.string
    })
  }),
  boyList: PropTypes.arrayOf(
    PropTypes.shape({
        id: PropTypes.number,
        account_name: PropTypes.string
    })
  ),
  primerList: PropTypes.arrayOf(
    PropTypes.shape({
        id: PropTypes.number,
        account_name: PropTypes.string
    })
  ),
  officerList: PropTypes.arrayOf(
    PropTypes.shape({
        id: PropTypes.number,
        account_name: PropTypes.string
    })
  )
}

export { AppointmentInformation }