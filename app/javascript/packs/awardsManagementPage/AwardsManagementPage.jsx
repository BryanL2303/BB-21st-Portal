import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AwardTracker } from './AwardTracker'
import { AwardInformation } from './AwardInformation'
import { AwardEditor } from './AwardEditor'
import useCookies from '../general/useCookies'
import { handleServerError } from '../general/handleServerError'

// To access current users and create new accounts
const AwardsManagementPage = () => {
	const cookies = useCookies()
	const [renderPage, setRenderPage] = useState(false)
	const [pageState, setPageState] = useState("tracker");
	const [awards, setAwards] = useState([]);

	useEffect(() => {
		// If there is no ongoing session go back to log in page
		axios.post("/application/0/check_session", {}, { withCredentials: true })
		.then(() => {
			setRenderPage(true)
		
			axios.post('/api/award/0/get_awards', {}, { withCredentials: true })
			.then(resp => setAwards(resp.data['awards']))
			.catch(resp => handleServerError(resp.response.status))
		})
		.catch(() => { window.location.href = '/' })		
	}, [])

	function showTracker() {
		setPageState('tracker')
	}

	function showAward() {
		setPageState('requirements')
	}

	if (!renderPage) return null

	return (
		<div className='award-management-page'>
			<div className='page-container'>
				<div className='toggle-buttons'>
					<input type="radio" name="toggle-buttons" id="tracker" onChange={showTracker} checked={pageState == "tracker"} role='Switch to Awards Tracker' />
					<label htmlFor="tracker">Awards Tracker</label>
					<input type="radio" name="toggle-buttons" id="requirements" onChange={showAward} checked={pageState == "requirements"} role='Switch to Award Requirements' />
					<label htmlFor="requirements">Award Requirements</label>
				</div>

				<div className='awards'>
					{pageState == "tracker" && <AwardTracker />}
					{pageState == "requirements" &&	(cookies.get("Type") != 'Admin' ? <AwardInformation awards={awards} /> : <AwardEditor awardId={pageState} />)}
				</div>
			</div>
		</div>
	)
}

export { AwardsManagementPage }