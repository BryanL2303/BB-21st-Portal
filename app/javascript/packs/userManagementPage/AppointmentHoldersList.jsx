import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'
import { AppointmentInformation } from './AppointmentInformation';

// To manage permissions for appointment holders
const AppointmentHoldersList = ({ account_type, load, reLoad }) => {
	const [appointments, setAppointments] = useState([])
	const [appointmentHolders, setAppointmentHolders] = useState({})
	const [boyList, setBoyList] = useState([])
	const [primerList, setPrimerList] = useState([])
	const [officerList, setOfficerList] = useState([])
	const [accountType, setAccountType] = useState()
	const [accountId, setAccountId] = useState()

	useEffect(() => {
		axios.post("/api/appointment/0/get_appointments", {}, { withCredentials: true })
		.then((resp) => {
			console.log(resp.data)
			setAppointments(resp.data.appointments)
			setAppointmentHolders(resp.data.appointment_to_accounts)
		})
		.catch(resp => handleServerError(resp.response.status))

		axios.post('/api/account/0/get_accounts_by_type', { account_type: "Boy" }, { withCredentials: true })
		.then(resp => setBoyList(resp.data))
		.catch(resp => handleServerError(resp.response.status))
		
		axios.post('/api/account/0/get_accounts_by_type', { account_type: "Primer" }, { withCredentials: true })
		.then(resp => setPrimerList(resp.data))
		.catch(resp => handleServerError(resp.response.status))

		axios.post('/api/account/0/get_accounts_by_type', { account_type: "Officer" }, { withCredentials: true })
		.then(resp => setOfficerList(resp.data))
		.catch(resp => handleServerError(resp.response.status))
	}, [load])

	function createAppointment(e) {
		e.preventDefault()
		let appointmentName = e.target[0].value
		if (appointmentName == '' || accountType == null || accountId == null) return alert("Please fill in all fields first.")
		
		axios.post("/api/appointment/0/create_appointment", { appointment_name: appointmentName, account_id: accountId, account_type: accountType }, { withCredentials: true })
		.then(() => reLoad())
		.catch(resp => handleServerError(resp.response.status))
	}

	return (
		<div className='appointment-holders-list'>
			<h2>Appointment Holders</h2>

			<div className='appointment-holders-users'>
				{appointments.map((appointment) =>
					<AppointmentInformation accountType={account_type} key={appointment.id} appointment={appointment} appointmentHolders={appointmentHolders} boyList={boyList} primerList={primerList} officerList={officerList} />
				)}
			</div>

			{(account_type == "Officer" || account_type == "Admin") && <form onSubmit={createAppointment}>
				<h3>Add Appointment</h3>

				<label>Appointment Name:</label>
				<input className='create-appointment-form__name' placeholder='Enter Appointment Name'></input>
				
				<label htmlFor='account-type'>Account Type: </label>
				<select id="account-type" onChange={(e) => setAccountType(e.target.value)} defaultValue={""}>
					<option value="" disabled hidden>Select Account Type</option>
					<option value="Officer">Officer</option>
					<option value="Primer">Primer</option>
					<option value="Boy">Boy</option>
				</select>
		
				{accountType && <>
					<label htmlFor='holder'>Current Appointment Holder:</label>
					<select id="holder" defaultValue={""} onChange={(e) => setAccountId(e.target.value)}>
						<option value="" disabled hidden>Select Appointment Holder</option>
						{(accountType === "Officer" ? officerList : (accountType === "Primer" ? primerList : boyList)).map(user => (
							<option key={user.id} value={user.id}>{user.account_name}</option>
						))}
					</select>
				</>}
			
				<button>Add New Appointment</button>
			</form>}
		</div>
	)
}

AppointmentHoldersList.propTypes = {
	account_type: PropTypes.string,
	load: PropTypes.bool.isRequired,
	reLoad: PropTypes.func.isRequired
}

export { AppointmentHoldersList }