import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import useCookies from '../general/useCookies'
import { handleServerError } from '../general/handleServerError'

// To create new accounts
const AccountCreationForm = ({ reLoad }) => {
	const cookies = useCookies()
	const [accountType, setAccountType] = useState('Boy');
	const [accountRank, setAccountRank] = useState('REC');
	const [accountLevel, setAccountLevel] = useState('1');
	const [accountClass, setAccountClass] = useState("VAL");
	const [accountHonorific, setAccountHonorific] = useState("Mr");
	const [accountRollCall, setAccountRollCall] = useState(true);

	function setType(e) {
		setAccountType(e.target.value)
		document.getElementById('account-type-input').value = e.target.value
		if (e.target.value == "Primer") setAccountRank('NIL')
		else if (e.target.value == 'Officer') setAccountRank("NIL")
	}

	// Sends the information from the form to the backend to try and create an account
	// If the username is not unique returns an alert back to the user
	function submitForm(e) {
		e.preventDefault()
		let submit = true

		if (accountType !== "Boy" && e.target.elements['credentials'].value == '') submit = false
		if (e.target.elements['user_name'].value == '' || e.target.elements['password'].value == '') submit = false
		
		if (submit) {
			axios.post('/api/account/0/create_account', {
				account_name: e.target.elements['account_name'].value,
				user_name: e.target.elements['user_name'].value,
				abbreviated_name: e.target.elements['abbreviated_name'].value,
				password: e.target.elements['password'].value,
				account_type: accountType,
				rank: accountRank === "NIL" ? null : accountRank,
				level: accountType === "Boy" ? accountLevel : null,
				class1: accountType === "Officer" ? accountClass : null,
				credentials: accountType !== "Boy" ? e.target.elements['credentials'].value : null,
				honorifics: accountType === "Officer" && (accountRank === "NIL" || accountClass === "STAFF") ? accountHonorific : undefined,
				roll_call: accountRollCall
			}, {
				withCredentials: true
			})
			.then(resp => {
				if (resp.data != false) {
					alert("Account has been created. If the user does not show up on the list to the left please refresh the page!")
					e.target.elements['account_name'].value = ''
					e.target.elements['user_name'].value = ''
					e.target.elements['abbreviated_name'].value = ''
					e.target.elements['password'].value = ''
					reLoad()
				} else alert("Username has been taken, please try another name.")
			})
			.catch(resp => handleServerError(resp.response.status))
		} else alert("Some fields are missing. Please try again.")
	}

	return (
		<form className='create-account-form' onSubmit={submitForm}>
			<h2>Account Creation</h2>

			<div>
				<label htmlFor='full-name-input'>Full Name:</label>
				<input name={'account_name'} placeholder='Enter Full Name' id='full-name-input' />

				<label htmlFor='user-name-input'>User Name:</label>
				<input name={"user_name"} placeholder='Enter User Name' id='user-name-input' />
				
				<label htmlFor='abbreviated-name-input'>Abbreviated Name:</label>
				<input name={"abbreviated_name"} placeholder='Enter Abbreviated Name' id='abbreviated-name-input' />

				<label htmlFor='password-input'>Password:</label>
				<input name={'password'} placeholder='Enter Password' autoComplete='new-password' id='password-input' />
				
				<label htmlFor='account-type-input'>Account Type: </label>
				<select name="account-type" id="account-type-input" onChange={(e) => setType(e)} defaultValue="Boy">
					{["Admin", "Officer"].includes(cookies.get('Type')) && <option value="Officer">Officer</option>}
					{["Admin", "Officer", "Primer"].includes(cookies.get('Type')) && <option value="Primer">Primer</option>}
					<option value="Boy">Boy</option>
				</select>

				{accountType && <label htmlFor="rank-input">Rank: </label>}
				{["Officer", "Primer", "Boy"].includes(accountType) && (
				<select id="rank-input"	onChange={(e) => setAccountRank(e.target.value)} defaultValue={accountType === "Boy" ? "REC" : "NIL"}>
					{accountType === "Officer" && (<>
						<option value="NIL">Not Applicable</option>
						<option value="OCT">OCT</option>
						<option value="2LT">2LT</option>
						<option value="LTA">LTA</option>
					</>)}
					{accountType === "Primer" && (<>
						<option value="NIL">Not Applicable</option>
						<option value="CLT">CLT</option>
						<option value="SCL">SCL</option>
					</>)}
					{accountType === "Boy" && (<>
						<option value="REC">REC</option>
						<option value="PTE">PTE</option>
						<option value="LCP">LCP</option>
						<option value="CPL">CPL</option>
						<option value="SGT">SGT</option>
						<option value="SSG">SSG</option>
						<option value="WO">WO</option>						
					</>)}
				</select>
				)}

				{(["Admin", "Officer"].includes(cookies.get("Type")) || cookies.get("Appointment") == 'CSM') && <>
					<label htmlFor='roll-call-input'>Attendance Appearance:</label>
					<select id="roll-call-input" onChange={(e) => setAccountRollCall(e.target.value == 'Yes')} defaultValue="Yes">
						<option value="Yes">Yes</option>
						<option value="No">No</option>
					</select>
				</>}

				{((accountClass == "STAFF" || accountRank == "NIL") && accountType == "Officer") && <>
					<label htmlFor='honorific-input'>Honorifics:</label>
					<select id="honorific-input" onChange={(e) => setAccountHonorific(e.target.value)}>
						<option value="Mr">Mr</option>
						<option value="Ms">Ms</option>
						<option value="Mrs">Mrs</option>
					</select>
				</>}

				{accountType == "Boy" && <>
					<label htmlFor='level-input'>Level:</label>
					<select id="level-input" onChange={(e) => setAccountLevel(e.target.value)} defaultValue="1">
						<option value="1">Secondary 1</option>
						<option value="2">Secondary 2</option>
						<option value="3">Secondary 3</option>
						<option value="4">Secondary 4</option>
						<option value="5">Secondary 5</option>
					</select>
				</>}

				{accountType == "Officer" &&<>
					<label htmlFor='class-input'>Class:</label>
					<select id="class-input" onChange={(e) => setAccountClass(e.target.value)} defaultValue="VAL">
						<option value="VAL">VAL</option>
						<option value="STAFF">STAFF</option>
						<option value="UNI">UNI</option>
						<option value="POLY">POLY</option>
					</select>
				</>}

				{(["Officer", "Primer"].includes(accountType)) && <>
					<label htmlFor='credentials-input'>Credentials (For 32A results): </label>
					<input className='account-credentials' name={'credentials'} placeholder='Enter Credentials' id='credentials-input' />
				</>}
			</div>

			<button>Create Account</button>
		</form>
	)
}

AccountCreationForm.propTypes = {
	reLoad: PropTypes.func.isRequired
}

export { AccountCreationForm }