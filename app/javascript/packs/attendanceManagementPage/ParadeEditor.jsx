import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { handleServerError } from '../general/handleServerError'

// To access attendance records and take new attendance
const ParadeEditor = ({ parade, boys, primers, officers, setReload, setPageState }) => {
	const levels = ['1', '2', '3', '4/5']
	const [companyAnnouncements, setCompanyAnnouncements] = useState(parade.company_announcements)
	const [platoonAnnouncements, setPlatoonAnnouncements] = useState(parade.platoon_announcements)
	const [platoonPrograms, setPlatoonPrograms] = useState(parade.platoon_programs)
	let paradeType = parade.info.parade_type
	let appointmentHolders = {'dt': parade.info.dt_id, 'do': parade.info.do_id, 'cos': parade.info.cos_id, 'flag_bearer': parade.info.flag_bearer_id, 'csm': parade.info.csm_id, 'ce': parade.info.ce_id}

	useEffect(() => {
		Object.keys(appointmentHolders).map((key) => {
			boys.map((boy) => {
				if (boy.id == appointmentHolders[key]) {
					document.getElementById(`${key}-input`).value = boy.id
				}
			})
			primers.map((primer) => {
				if (primer.id == appointmentHolders[key]) {
					document.getElementById(`${key}-input`).value = primer.id
				}
			})
			officers.map((officer) => {
				if (officer.id == appointmentHolders[key]) {
					document.getElementById(`${key}-input`).value = officer.id
				}
			})
		})
	}, [])

	function setDefaultDate(e) {
		let reportingTimeInput = document.getElementsByClassName('reporting-time-input')[0]
		reportingTimeInput.value = e.target.value + 'T08:30'
		let dismissalTimeInput = document.getElementsByClassName('dismissal-time-input')[0]
		dismissalTimeInput.value = e.target.value + 'T12:30'
		levels.map((level) => {
			document.getElementsByName('sec-' + level + '-start-time')[0].value = e.target.value + 'T00:00'
			document.getElementsByName('sec-' + level + '-end-time')[0].value = e.target.value + 'T00:00'
		})
	}

	function setParadeType(e) {
		document.getElementsByClassName('parade__type')[0].innerHTML = e.target.className
		paradeType = e.target.className
	}

	function setAccount(appointment, e) {
		appointmentHolders[appointment] = e.target.value
	}

	function addCompanyAnnouncement() {
		let newAnnouncement = document.getElementsByName('new-company-announcement')[0].value
		if (newAnnouncement != '') {
			setCompanyAnnouncements((prev) => {
				return [...prev, { announcement: newAnnouncement }]
			})
		} else {
			alert("The company announcement cannot be empty!")
		}
	}

	function updateCompanyAnnouncement(e, index) {
		setCompanyAnnouncements((prev) => {
			prev[index].announcement = e.target.value
			return [...prev]
		})
	}

	function deleteCompanyAnnouncement(index) {
		setCompanyAnnouncements((prev) => {
			prev.splice(index, 1)
			return [...prev]
		})
	}

	function addPlatoonProgram(level) {
		let newProgram = document.getElementsByName('sec-' + level + '-program-new')[0].value
		let newStartTime = document.getElementsByName('sec-' + level + '-start-time-new')[0].value
		let newEndTime = document.getElementsByName('sec-' + level + '-end-time-new')[0].value
		if (newProgram != '') {
			setPlatoonPrograms((prev) => {
				prev[level] = [...prev[level], { start_time: newStartTime, end_time: newEndTime, program: newProgram }]
				return { ...prev }
			})
		} else {
			alert("Please fill in all the fields!")
		}
	}

	function updatePlatoonProgram(e, level, index, column) {
		setPlatoonPrograms((prev) => {
			prev[level][index][column] = e.target.value
			return { ...prev }
		})
	}

	function deletePlatoonProgram(level, index) {
		setPlatoonPrograms((prev) => {
			prev[level].splice(index, 1)
			return { ...prev }
		})
	}

	function addPlatoonAnnouncement(level) {
		let newAnnouncement = document.getElementsByName('sec-' + level + '-announcement')[0].value
		if (newAnnouncement != '') {
			setPlatoonAnnouncements((prev) => {
				prev[level] = [...prev[level], { announcement: newAnnouncement }]
				return { ...prev }
			})
		} else {
			alert("The platoon announcement cannot be empty!")
		}
	}

	function updatePlatoonAnnouncement(e, level) {
		const index = e.target.getAttribute("data-index")
		if (index === null || index === undefined) {
			return alert("Platoon Announcement index not found. This is most likely a development error. If you see error, please contact the admin.")
		}

		setPlatoonAnnouncements((prev) => {
			const newAnnouncements = [...prev[level]];
			newAnnouncements[index] = { ...newAnnouncements[index], announcement: e.target.value };
			return { ...prev, [level]: newAnnouncements };
		})
	}

	function deletePlatoonAnnouncement(level, index) {
		setPlatoonAnnouncements((prev) => {
			prev[level].splice(index, 1)
			return { ...prev }
		})
	}

	function submitForm(e) {
		e.preventDefault()
		let submit = true
		if (e.target.elements['date'].value == "") {
			submit = false
		}
		if (submit) {
			axios.post('/api/parade/' + parade.info.id + '/edit_parade', {
				parade_type: paradeType,
				date: e.target.elements['date'].value,
				venue: e.target.elements['venue'].value,
				sec_1_attire: e.target.elements['sec_1_attire'].value,
				sec_2_attire: e.target.elements['sec_2_attire'].value,
				sec_3_attire: e.target.elements['sec_3_attire'].value,
				sec_4_5_attire: e.target.elements['sec_4_5_attire'].value,
				reporting_time: e.target.elements['reporting_time'].value,
				dismissal_time: e.target.elements['dismissal_time'].value,
				dt_id: appointmentHolders['dt'],
				do_id: appointmentHolders['do'],
				cos_id: appointmentHolders['cos'],
				flag_bearer_id: appointmentHolders['flag_bearer'],
				csm_id: appointmentHolders['csm'],
				ce_id: appointmentHolders['ce'],
				description: e.target.elements['description'].value,
				company_announcements: companyAnnouncements,
				platoon_programs: platoonPrograms,
				platoon_announcements: platoonAnnouncements
			}, {
				withCredentials: true
			})
			.then(() => {
				alert("Changes has been saved!")
				setReload((prev) => {
					return !prev
				})
			})
			.catch(resp => handleServerError(resp.response.status))
		}
	}

	function deleteParade() {
		if (window.confirm("Deleting the parade will also remove all other information related to it such as attendance taken.\nAre you sure you want to proceed?")) {
			axios.post('/api/parade/' + parade.info.id + '/delete_parade', {})
				.then(() => {
					setReload((prev) => {
						return !prev
					})
					alert("Parade has been deleted")
					setPageState('list')
				})
				.catch(resp => handleServerError(resp.response.status))
		}
	}

	return (
		<form className='parade-editor new-parade-form' onSubmit={submitForm}>
			<h2>Parade - {parade.info.date.split('T')[0]}</h2>

			<div>
				<label htmlFor='parade-type-select'>Parade Type:</label>
				<select name="parade_type" id="parade-type-select" onChange={e => setParadeType(e)}>
					<option value="Parade">Parade</option>
					<option value="Camp">Camp</option>
					<option value="Others">Others</option>
				</select>
			</div>
		
			<div className='flex-block'>
				<div className="half-block">
					<label htmlFor='date'>Date:</label>
					<input type='date' id='date' name='date' defaultValue={parade.info.date.split('T')[0]} onChange={setDefaultDate} />
					
					<label htmlFor='venue'>Venue:</label>
					<input name='venue' id='venue' defaultValue={parade.info.venue} />
					
					<label htmlFor='sec-1-attire'>Sec 1 Attire:</label>
					<input name='sec_1_attire' id='sec-1-attire' defaultValue={parade.info.sec_1_attire} placeholder='Enter Sec 1 Attire' />
					
					<label htmlFor='sec-2-attire'>Sec 2 Attire:</label>
					<input name='sec_2_attire' id='sec-2-attire' defaultValue={parade.info.sec_2_attire} placeholder='Enter Sec 2 Attire' />
					
					<label htmlFor='sec-3-attire'>Sec 3 Attire:</label>
					<input name='sec_3_attire' id='sec-3-attire' defaultValue={parade.info.sec_3_attire} placeholder='Enter Sec 3 Attire' />
					
					<label htmlFor='sec-4-5-attire'>Sec 4 / 5 Attire:</label>
					<input name='sec_4_5_attire' id='sec-4-5-attire' defaultValue={parade.info.sec_4_5_attire} placeholder='Enter Sec 4 / 5 Attire' />
					
					<label htmlFor='reporting-time'>Reporting Time:</label>
					<input name='reporting_time' id='reporting-time' className='reporting-time-input' type='datetime-local' defaultValue={parade.info.reporting_time.slice(0, 16)} />
					
					<label htmlFor='dismissal-time'>Dismissal Time:</label>
					<input name='dismissal_time' id='dismissal-time' className='dismissal-time-input' type='datetime-local' defaultValue={parade.info.dismissal_time.slice(0, 16)} />
				</div>

				<div className="half-block">
					<label htmlFor='dt-input'>Duty Teacher:</label>
					<select name="dt" id="dt-input" onChange={(e) => setAccount('dt', e)}>
						<option value="">Select Duty Officer</option>
						{officers.map((officer) => {
							if (officer.class_1 == 'STAFF') {
								return (<option key={officer.id} value={officer.id} className={officer.account_name}>{officer.account_name}</option>)
							}
						})}						

					</select>

					<label htmlFor='do-input'>Duty Officer:</label>
					<select name="do" id="do-input" onChange={(e) => setAccount('do', e)}>
						<option value="">Select Duty Officer</option>
						{officers.map((officer) => {
							return (<option key={officer.id} value={officer.id} className={officer.account_name}>{officer.account_name}</option>)
						})}
						{primers.map((primer) => {
							return (<option key={primer.id} value={primer.id} className={primer.account_name}>{primer.account_name}</option>)
						})}
					</select>
					
					<label htmlFor='cos-input'>COS:</label>
					<select name="cos" id="cos-input" onChange={(e) => setAccount('cos', e)}>
						<option value="">Select COS</option>
						{boys.map((boy) => {
							return (<option key={boy.id} value={boy.id} className={boy.account_name}>{boy.account_name}</option>)
						})}
					</select>

					<label htmlFor='flag_bearer-input'>Flag Bearer:</label>
					<select name="flag_bearer" id="flag_bearer-input" onChange={(e) => setAccount('flag_bearer', e)}>
						<option value="">Select Flag Bearer</option>
						{boys.map((boy) => {
							return (<option key={boy.id} value={boy.id} className={boy.account_name}>{boy.account_name}</option>)
						})}
					</select>

					<label htmlFor='csm-input'>CSM:</label>
					<select name="csm" id="csm-input" onChange={(e) => setAccount('csm', e)}>
						<option value="">Select CSM</option>
						{boys.map((boy) => {
							return (<option key={boy.id} value={boy.id} className={boy.account_name}>{boy.account_name}</option>)
						})}
					</select>

					<label htmlFor='ce-input'>CE:</label>
					<select name="ce" id="ce-input" onChange={(e) => setAccount('ce', e)}>
						<option value="">Select CE</option>
						{boys.map((boy) => {
							return (<option key={boy.id} value={boy.id} className={boy.account_name}>{boy.account_name}</option>)
						})}
					</select>
				</div>
			</div>

			<div>
				<label htmlFor='description'>Description:</label>
				<textarea name='description' id='description' defaultValue={parade.info.description}></textarea>
			</div>

			<div>
				<h3>Company Announcements:</h3>
				<div>
					{companyAnnouncements.length > 0 ? (
						<ol>
							{companyAnnouncements.map((announcement, index) => {
								return (
									<li key={'company' + announcement.announcement}>
										<input defaultValue={announcement.announcement} onBlur={(e) => { updateCompanyAnnouncement(e, index) }} id={`company-announcement-${index + 1}`} placeholder='Enter Announcement' />
										<button type='button' onClick={() => deleteCompanyAnnouncement(index)} aria-label='Remove Company Announcment'>
											<i className='fa-solid fa-xmark'></i>
										</button>
									</li>
								)
							})}
						</ol>
					) : (
						<p>No Announcements</p>
					)}
				</div>

				<div className='new-announcement-container'>
					<label htmlFor='new-company-announcement'>New Announcement:</label>
					<input name='new-company-announcement' id='new-company-announcement' placeholder='Enter Announcement' />
					<button type='button' onClick={addCompanyAnnouncement} aria-label='Add Company Announcment'>
						<i className='fa-solid fa-plus'></i>
					</button>
				</div>
			</div>

			<div>
				{levels.map((level) => {
					return (
						<div key={level}>
							<h3>Programs:</h3>
							<div>
								{platoonPrograms[level].length > 0 ? (
									platoonPrograms[level].map((program, index) => {
										return (
											<div key={level + program.program} className='platoon-program-container'>
												<div>
													<div>
														<input type='datetime-local' defaultValue={program.start_time.slice(0, 16)} onBlur={(e) => { updatePlatoonProgram(e, level, index, 'start_time') }} name={'sec-' + level + '-start-time'} />
														<p>-</p>
														<input type='datetime-local' defaultValue={program.end_time.slice(0, 16)} onBlur={(e) => { updatePlatoonProgram(e, level, index, 'end_time') }} name={'sec-' + level + '-end-time'} />
													</div>
													
													<input type='text' defaultValue={program.program} onBlur={(e) => { updatePlatoonProgram(e, level, index, 'program') }} name={'sec-' + level + '-program'} placeholder='Enter Program' />
												</div>
												
												<button type='button' onClick={() => deletePlatoonProgram(level, index)} aria-label='Remove Platoon Program'>
													<i className='fa-solid fa-xmark'></i>
												</button>
											</div>
										)
									})
								) : (
									<p>No Programs</p>
								)}

								<div className='platoon-program-container'>
									<div>
										<div>
											<input type='datetime-local' name={'sec-' + level + '-start-time-new'} />
											<p>-</p>
											<input type='datetime-local' name={'sec-' + level + '-end-time-new'} />
										</div>
										
										<input type='text' name={'sec-' + level + '-program-new'}  placeholder='Enter Program' />
									</div>
									
									<button type='button' onClick={() => addPlatoonProgram(level)} aria-label='Add Platoon Program'>
										<i className='fa-solid fa-plus'></i>
									</button>
								</div>
							</div>

							<h3>Platoon Announcements:</h3>
							<div>
								{platoonAnnouncements[level].length > 0 ? (
									<ol id={'sec-' + level + '-announcement-list'}>
										{platoonAnnouncements[level].map((announcement, index) => {
											return (
												<li key={level + announcement.announcement}>
													<input defaultValue={announcement.announcement} data-index={index} onBlur={(e) => { updatePlatoonAnnouncement(e, level) }} placeholder='Enter Announcement' name={'sec-' + level + '-announcement'} />
													<button type='button' onClick={() => deletePlatoonAnnouncement(level, index)} aria-label='Remove Platoon Announcement'>
														<i className='fa-solid fa-xmark'></i>
													</button>
												</li>
											)
										})}
									</ol>
								) : (
									<p>No Announcements</p>
								)}

								<div className='new-announcement-container'>
									<label htmlFor={'sec-' + level + '-announcement'}>New Announcement:</label>
									<input name={'sec-' + level + '-announcement'} id={'sec-' + level + '-announcement'}  placeholder='Enter Announcement' />
									<button type='button' onClick={() => addPlatoonAnnouncement(level)} aria-label='Add Platoon Announcment'>
										<i className='fa-solid fa-plus'></i>
									</button>
								</div>
							</div>
						</div>
					)
				})}
			</div>

			<button>Save Changes</button>
			<button type='button' onClick={deleteParade}>Delete Parade</button>
		</form>
	)
}

ParadeEditor.propTypes = {
	setPageState: PropTypes.func.isRequired,
	setReload: PropTypes.func.isRequired,
	boys: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		account_name: PropTypes.string,
	})),
	primers: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		account_name: PropTypes.string,
	})),
	officers: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		account_name: PropTypes.string,
	})),
	parade: PropTypes.shape({
		info: PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			parade_type: PropTypes.string,
			date: PropTypes.string,
			venue: PropTypes.string,
			dt_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			do_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			cos_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			flag_bearer_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			csm_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			ce_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			sec_1_attire: PropTypes.string,
			sec_2_attire: PropTypes.string,
			sec_3_attire: PropTypes.string,
			sec_4_5_attire: PropTypes.string,
			reporting_time: PropTypes.string,
			dismissal_time: PropTypes.string,
			cos_finalized: PropTypes.bool,
			csm_finalized: PropTypes.bool,
			do_finalized: PropTypes.bool,
			captain_finalized: PropTypes.bool,
			description: PropTypes.string,
		}),
		parade_attendance: PropTypes.objectOf(
			PropTypes.shape({
				id: PropTypes.number.isRequired,
				account_id: PropTypes.number.isRequired,
				attendance: PropTypes.string.isRequired,
				level: PropTypes.number,
				parade_id: PropTypes.number,
			})
		),
		company_announcements: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.number.isRequired,
				announcement: PropTypes.string.isRequired,
				parade_id: PropTypes.number,
				created_at: PropTypes.string.isRequired,
				updated_at: PropTypes.string,
			})
		),
		platoon_announcements: PropTypes.objectOf(
			PropTypes.arrayOf(
				PropTypes.shape({
					id: PropTypes.number.isRequired,
					announcement: PropTypes.string.isRequired,
					parade_id: PropTypes.number,
					created_at: PropTypes.string.isRequired,
					updated_at: PropTypes.string,
				})
			)
		),
		platoon_programs: PropTypes.objectOf(
			PropTypes.arrayOf(
				PropTypes.shape({
					id: PropTypes.number,
					program: PropTypes.string.isRequired,
					parade_id: PropTypes.number,
					created_at: PropTypes.string.isRequired,
					updated_at: PropTypes.string,
					level: PropTypes.string.isRequired,
					start_time: PropTypes.string.isRequired,
					end_time: PropTypes.string.isRequired
				})
			)
		),
		cos: PropTypes.shape({
			account_name: PropTypes.string,
		}),
		csm: PropTypes.shape({
			account_name: PropTypes.string,
		}),
		do: PropTypes.shape({
			account_name: PropTypes.string,
		}),
	}),
}

export { ParadeEditor }