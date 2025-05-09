import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// To manage permissions for appointment holders
const AppointmentInformation = ({ accountType, appointment, appointmentHolders, boyList, primerList, officerList }) => {
	const coreAppointments = ['Captain', 'CSM', 'DY CSM', 'Sec 4/5 PS', 'Sec 3 PS', 'Sec 2 PS', 'Sec 1 PS']
	const [accountId, setAccountId] = useState()

	function updateAppointmentHolder(e) {
		e.preventDefault()
		if (accountId != appointmentHolders[appointment.id]['id'] && accountId != null) {
			axios.post("/api/appointment/" + e.target.id + "/update_appointment", {
				account_id: accountId
			},
				{ withCredentials: true })
				.then(alert("Appointment holder has been updated."))
				.catch(resp => handleServerError(resp.response.status))
		} else {
			alert("The current selected account is already the appointment holder.")
		}
	}

	// On button click should send appointment_id to API to delete
	// This should only be possible for non core appointments
	function deleteAppointment(appointmentId) {
		axios.post(`/api/appointment/${appointmentId}/delete_appointment`, {}, { withCredentials: true })
		.then(() => alert("Appointment has been removed."))
		.catch(resp => handleServerError(resp.response.status))
	}

	return (
		<>
			<label htmlFor={appointment.appointment_name}>{appointment.appointment_name}:</label>
			<select id={appointment.appointment_name} defaultValue={appointmentHolders[appointment.id]['id']} onChange={(e) => setAccountId(e.target.value)}>
				<option value={appointmentHolders[appointment.id]['id']}>{appointmentHolders[appointment.id]['account_name']}</option>
				{["Officer", "Admin"].includes(accountType) && (appointment.account_type == 'Officer' ? officerList : (appointment.account_type  === "Primer" ? primerList : boyList)).map(user => (
					<option key={user.id} value={user.id}>{user.account_name}</option>
				))}
			</select>

			<div>
				{["Officer", "Admin"].includes(accountType) && <button id={appointment.id} className={appointment.appointment_name} onClick={updateAppointmentHolder}>Update</button>}
				{["Officer", "Admin"].includes(accountType) && !(coreAppointments.includes(appointment.appointment_name)) && <button onClick={() => deleteAppointment(appointment.id)}>Remove</button>}
			</div>
		</>
	)
}

AppointmentInformation.propTypes = {
	accountType: PropTypes.string,
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