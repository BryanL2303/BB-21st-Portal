import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { handleServerError } from '../general/handleServerError'

// To access attendance records and take new attendance
const NewParadeForm = ({ setReload }) => {
	const levels = ['1', '2', '3', '4/5']
	const [boyList, setBoyList] = useState([])
	const [primerList, setPrimerList] = useState([])
	const [officerList, setOfficerList] = useState([])
	const [companyAnnouncements, setCompanyAnnouncements] = useState([])
	const [platoonAnnouncements, setPlatoonAnnouncements] = useState({ '1': [], '2': [], '3': [], '4/5': [] })
	const [platoonPrograms, setPlatoonPrograms] = useState({ '1': [], '2': [], '3': [], '4/5': [] })
	const [paradeType, setParadeType] = useState("Parade")
	const [appointmentHolders, setAppointmentHolders] = useState({ 'dt': null, 'do': null, 'cos': null, 'flag_bearer': null, 'csm': null, 'ce': null })

	useEffect(() => {
		loadList()
	}, [])

	function loadList() {
		axios.post('/api/account/0/get_accounts_by_type', {
			account_type: "Boy"
		}, {
			withCredentials: true
		})
		.then(resp => {
			setBoyList(resp.data)

			let updatedAppointments = { ...appointmentHolders };

			resp.data.map((boy) => {
				if (boy.appointment === 'CSM') {
					updatedAppointments['csm'] = boy.id;
				}

				if (boy.appointment === 'CE Sergeant') {
					updatedAppointments['ce'] = boy.id;
				}
			})

			setAppointmentHolders(updatedAppointments)
		})
		.catch(resp => handleServerError(resp.response.status))

		axios.post('/api/account/0/get_accounts_by_type', {
			account_type: "Primer"
		}, {
			withCredentials: true
		})
			.then(resp => {
				setPrimerList(resp.data)
			})
			.catch(resp => handleServerError(resp.response.status))
		axios.post('/api/account/0/get_accounts_by_type', {
			account_type: "Officer"
		}, {
			withCredentials: true
		})
			.then(resp => {
				setOfficerList(resp.data)
			})
			.catch(resp => handleServerError(resp.response.status))
	}

	function setDefaultDate(e) {
		let reportingTimeInput = document.getElementsByClassName('reporting-time-input')[0]
		reportingTimeInput.value = e.target.value + 'T08:30'
		let dismissalTimeInput = document.getElementsByClassName('dismissal-time-input')[0]
		dismissalTimeInput.value = e.target.value + 'T12:30'
		levels.map((level) => {
			document.getElementsByName('sec-' + level + '-start-time')[0].value = e.target.value + 'T08:30'
			document.getElementsByName('sec-' + level + '-end-time')[0].value = e.target.value + 'T12:30'
		})
		if (paradeType == 'Parade') {
			setCompanyAnnouncements([{ announcement: 'All to bring PT Kit' }])
			setPlatoonPrograms({
				'1': [{ start_time: e.target.value + 'T08:30', end_time: e.target.value + 'T08:45', program: 'Opening Parade' },
				{ start_time: e.target.value + 'T08:45', end_time: e.target.value + 'T09:45', program: 'CE and Worship' },
				{ start_time: e.target.value + 'T09:45', end_time: e.target.value + 'T11:00', program: 'Program 1' },
				{ start_time: e.target.value + 'T11:00', end_time: e.target.value + 'T12:00', program: 'Program 2' },
				{ start_time: e.target.value + 'T12:00', end_time: e.target.value + 'T12:15', program: 'Closing Parade' }
				],
				'2': [{ start_time: e.target.value + 'T08:30', end_time: e.target.value + 'T08:45', program: 'Opening Parade' },
				{ start_time: e.target.value + 'T08:45', end_time: e.target.value + 'T09:45', program: 'CE and Worship' },
				{ start_time: e.target.value + 'T09:45', end_time: e.target.value + 'T11:00', program: 'Program 1' },
				{ start_time: e.target.value + 'T11:00', end_time: e.target.value + 'T12:00', program: 'Program 2' },
				{ start_time: e.target.value + 'T12:00', end_time: e.target.value + 'T12:15', program: 'Closing Parade' }],
				'3': [{ start_time: e.target.value + 'T08:30', end_time: e.target.value + 'T08:45', program: 'Opening Parade' },
				{ start_time: e.target.value + 'T08:45', end_time: e.target.value + 'T09:45', program: 'CE and Worship' },
				{ start_time: e.target.value + 'T09:45', end_time: e.target.value + 'T11:00', program: 'Program 1' },
				{ start_time: e.target.value + 'T11:00', end_time: e.target.value + 'T12:00', program: 'Program 2' },
				{ start_time: e.target.value + 'T12:00', end_time: e.target.value + 'T12:15', program: 'Closing Parade' }],
				'4/5': []
			})
		}
	}

	function setParade(e) {
		setParadeType(e.target.value)
		if (paradeType != 'Parade') {
			setCompanyAnnouncements([])
			setPlatoonPrograms({ '1': [], '2': [], '3': [], '4/5': [] })
			setPlatoonAnnouncements({ '1': [], '2': [], '3': [], '4/5': [] })
		}
	}

	function setAccount1(appointment, value) {
		setAppointmentHolders((prev) => {
			prev[appointment] = value.target.value
			return { ...prev }
		})
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
		let newAnnouncement = document.getElementById('sec-' + level + '-announcement').value
		if (newAnnouncement != '') {
			setPlatoonAnnouncements((prev) => {
				prev[level] = [...prev[level], { announcement: newAnnouncement }]
				return { ...prev }
			})
		} else {
			alert("The platoon announcement cannot be empty")
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
			axios.post('/api/parade/0/create_parade', {
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
				alert("Parade has been added!")
				setReload((prev) => !prev)
			})
			.catch(resp => handleServerError(resp.response.status))
		}
	}

	return (
		<form onSubmit={submitForm} className='new-parade-form'>
			<h2>Create New Parade Notice</h2>

			<div>
				<label htmlFor='parade-type-select'>Parade Type:</label>
				<select name="parade_type" id="parade-type-select" onChange={e => setParade(e)}>
					<option value="Parade">Parade</option>
					<option value="Camp">Camp</option>
					<option value="Others">Others</option>
				</select>
			</div>

			<div className='flex-block'>
				<div className="half-block">
					<label htmlFor='date-input'>Date: </label>
					<input type='date' name='date' onChange={setDefaultDate} id='date-input'></input>

					<label htmlFor='venue-input'>Venue: </label>
					<input name='venue' defaultValue='School, GMSS' id='venue-input' placeholder='Enter Parade Venue'></input>

					<label htmlFor='sec-1-attire'>Sec 1 Attire:</label>
					<input name='sec_1_attire' id='sec-1-attire' placeholder='Enter Sec 1 Attire'></input>

					<label htmlFor='sec-2-attire'>Sec 2 Attire: </label>
					<input name='sec_2_attire' id='sec-2-attire' placeholder='Enter Sec 2 Attire'></input>

					<label htmlFor='sec-3-attire'>Sec 3 Attire: </label>
					<input name='sec_3_attire' id='sec-3-attire' placeholder='Enter Sec 3 Attire'></input>

					<label htmlFor='sec-4-5-attire'>Sec 4 / 5 Attire: </label>
					<input name='sec_4_5_attire' id='sec-4-5-attire' placeholder='Enter Sec 4 / 5 Attire'></input>

					<label htmlFor='reporting-time-input'>Reporting Time: </label>
					<input name='reporting_time' className='reporting-time-input' type='datetime-local' id='reporting-time-input'></input>

					<label htmlFor='dismissal-time-input'>Dismissal Time: </label>
					<input name='dismissal_time' className='dismissal-time-input' type='datetime-local' id='dismissal-time-input'></input>
				</div>

				<div className="half-block">
					<label htmlFor='dt-select'>Duty Teacher:</label>
					<select name="dt" id="dt-select" onChange={(e) => setAccount1('dt', e)} defaultValue={""}>
						<option value='' disabled={true}>Select Duty Teacher</option>
						{officerList.map((officer) => {
							return (<option key={officer.id} id={officer.id} value={officer.id}>{officer.account_name}</option>)
						})}
					</select>

					<label htmlFor='do-select'>Duty Officer:</label>
					<select name="do" id="do-select" onChange={(e) => setAccount1('do', e)} defaultValue={""}>
						<option value='' disabled>Select Duty Officer</option>
						{officerList.map((officer) => {
							return (<option key={officer.id} id={officer.id} value={officer.id}>{officer.account_name}</option>)
						})}
						{primerList.map((primer) => {
							return (<option key={primer.id} id={primer.id} value={primer.id}>{primer.account_name}</option>)
						})}
					</select>

					<label htmlFor='cos-select'>COS:</label>
					<select name="cos" id="cos-select" onChange={(e) => setAccount1('cos', e)} defaultValue={""}>
						<option value='' disabled={true}>Select COS</option>
						{boyList.map((boy) => {
							return (<option key={boy.id} id={boy.id} value={boy.id}>{boy.account_name}</option>)
						})}
					</select>

					<label htmlFor='flag-bearer-select'>Flag Bearer:</label>
					<select name="flag_bearer" id="flag-bearer-select" onChange={(e) => setAccount1('flag_bearer', e)} defaultValue={""}>
						<option value='' disabled={true}>Select Flag Bearer</option>
						{boyList.map((boy) => {
							return (<option key={boy.id} id={boy.id} value={boy.id}>{boy.account_name}</option>)
						})}
					</select>

					<label htmlFor='csm-select'>CSM:</label>
					<select name="csm" id="csm-select" value={appointmentHolders.csm ?? ''} onChange={(e) => setAccount1('csm', e)}>
						{boyList.map((boy) => {
							return (<option key={boy.id} value={boy.id}>{boy.account_name}</option>)
						})}
					</select>

					<label htmlFor='ce-select'>CE:</label>
					<select name="ce" id="ce-select" value={appointmentHolders.ce ?? ''} onChange={(e) => setAccount1('ce', e)}>
						{boyList.map((boy) => {
							return (<option key={boy.id} value={boy.id}>{boy.account_name}</option>)
						})}
					</select>
				</div>
			</div>

			<div>
				<label htmlFor='description'>Description: </label>
				<textarea name='description' placeholder='Remarks (if any)' id='description'></textarea>
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

			<button>Add Parade</button>
		</form>
	)
}

NewParadeForm.propTypes = {
	setReload: PropTypes.func.isRequired
}

export { NewParadeForm }