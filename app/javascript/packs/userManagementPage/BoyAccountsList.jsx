import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// Display list of Boy Accounts
const BoyAccountsList = ({ setPageState, load }) => {
	const [boyList, setBoyList] = useState([])

	useEffect(() => {
		loadList()
	}, [load])

	function loadList() {
		axios.post('/api/account/0/get_accounts_by_type', { account_type: "Boy" }, {
			withCredentials: true
		})
		.then(resp => {
			setBoyList(resp.data)
		})
		.catch(resp => handleServerError(resp.response.status))
	}

	return (
		<>
			{boyList.map((boy) => {
				return (
					<React.Fragment key={boy.id}>
						<input type="radio" name="users-list" id={boy.id} onChange={(e) => setPageState(e.target.id)} />
						<label htmlFor={boy.id}>{boy.account_type} Sec {boy.level} {boy.rank} {boy.account_name}</label>
					</React.Fragment>
				)
			})}
		</>
	)
}

BoyAccountsList.propTypes = {
	setPageState: PropTypes.func.isRequired,
	load: PropTypes.bool.isRequired
}

export { BoyAccountsList }