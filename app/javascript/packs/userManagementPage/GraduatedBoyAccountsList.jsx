import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// Display list of Graduated Boy Accounts
const GraduatedBoyAccountsList = ({ setPageState, load }) => {
	const [graduatedBoyList, setGraduatedBoyList] = useState([])

	useEffect(() => {
		loadList()
	}, [load])

	function loadList() {
		axios.post('/api/account/0/get_graduated_accounts', {}, { withCredentials: true })
		.then(resp => {
			setGraduatedBoyList(resp.data)
		})
		.catch(resp => handleServerError(resp.response.status))
	}

	return (
		<>
			{graduatedBoyList.map((boy) => {
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

GraduatedBoyAccountsList.propTypes = {
	setPageState: PropTypes.func.isRequired,
	load: PropTypes.bool.isRequired
}

export { GraduatedBoyAccountsList }