import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// Display list of all primer Accounts
const PrimerAccountsList = ({ setPageState, load }) => {
	const [primerList, setPrimerList] = useState([])

	useEffect(() => {
		loadList()
	}, [load])

	function loadList() {
		axios.post('/api/account/0/get_accounts_by_type', { account_type: "Primer" }, {
			withCredentials: true
		})
		.then(resp => {
			setPrimerList(resp.data)
		})
		.catch(resp => handleServerError(resp.response.status))
	}

	return (
		<>
			{primerList.map((primer) => {
				return (
					<React.Fragment key={primer.id}>
						<input type="radio" name="users-list" id={primer.id} onChange={(e) => setPageState(e.target.id)} />
						<label htmlFor={primer.id}>{primer.account_type} {primer.rank} {primer.account_name}</label>
					</React.Fragment>
				)
			})}
		</>
	)
}

PrimerAccountsList.propTypes = {
	setPageState: PropTypes.func.isRequired,
	load: PropTypes.bool.isRequired
}

export { PrimerAccountsList }