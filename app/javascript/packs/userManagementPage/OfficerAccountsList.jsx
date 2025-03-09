import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// Display list of all officer Accounts
const OfficerAccountsList = ({ setPageState, load }) => {
	const [officerList, setOfficerList] = useState([])

	useEffect(() => {
		loadList()
	}, [load])

	function loadList() {
		axios.post('/api/account/0/get_accounts_by_type', { account_type: "Officer" }, {
			withCredentials: true
		})
		.then(resp => {
			setOfficerList(resp.data)
		})
		.catch(resp => handleServerError(resp.response.status))
	}

	return (
		<>
			{officerList.map((officer) => {
				return (
					<React.Fragment key={officer.id}>
						<input type="radio" name="users-list" id={officer.id} onChange={(e) => setPageState(e.target.id)} />
						<label htmlFor={officer.id}>{officer.account_type} {officer.rank} {officer.account_name}</label>
					</React.Fragment>
				)
			})}
		</>
	)
}

OfficerAccountsList.propTypes = {
	setPageState: PropTypes.func.isRequired,
	load: PropTypes.bool.isRequired
}

export { OfficerAccountsList }