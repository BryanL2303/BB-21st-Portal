import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// To facilitate uniform inspection by officers / primers
const UniformInspectionResultPage = () => {
	const [components, setComponents] = useState([]);
	const [componentFields, setComponentFields] = useState({})
	const [currentInspection, setCurrentInspection] = useState()
	const [inspections, setInspections] = useState();
	const [allInspections, setAllInspections] = useState();
	const [boys, setBoys] = useState([]);
	const { id } = useParams()

	// If there is no ongoing session go back to log in page
	axios.post("/application/0/check_session", {}, {
		withCredentials: true
	})
	.then()
	.catch(() => { window.location.href = '/' })

	useEffect(() => {
		axios.post('/api/uniform_inspection/0/get_component_fields', {}, {
			withCredentials: true  // Include credentials (cookies)
		})
		.then(resp => {
			setComponents(resp.data['components'])
			setComponentFields(resp.data)
			console.log(resp.data)
		})
		.catch(resp => handleServerError(resp.response.status))

		axios.post('/api/uniform_inspection/' + id + '/get_inspection', { 'id': id })
		.then(resp => {
			setAllInspections(resp.data['inspections'])
			setInspections(resp.data['inspections'][resp.data['boy']['id']])
			setCurrentInspection(resp.data['inspections'][resp.data['boy']['id']][id])
			setBoys(resp.data['boys'])
			console.log(resp.data)
		})
		.catch(resp => handleServerError(resp.response.status))
	}, [])

	function selectInspection(e) {
		setCurrentInspection(inspections[e.target.value])
	}

	function selectBoy(e) {
		let relevantInspections = allInspections[e.target.value]
		let defaultInspection = relevantInspections['inspections'][0]
		setInspections(relevantInspections)
		setCurrentInspection(relevantInspections[defaultInspection['id']])
	}

	return (
		<div className='uniform-inspection-result-page'>
			<div className='page-container'>
				<h2>Past Inspection Results</h2>

				<div>
					<div>
						<label htmlFor='boy-select'>Viewing Results of:</label>
						{boys.length != 0 && <select onChange={selectBoy} id='boy-select'>
							{boys.map((boy) => {
								return (
									<option key={boy.id} value={boy.id}>{boy.rank} {boy.account_name}</option>
								)
							})}
						</select>}

						<label htmlFor='inspection-select'>On</label>
						{inspections != null && inspections['inspections'].length != 0 && <select className='date-select' id='inspection-select' onChange={selectInspection}>
							{inspections['inspections'].map((inspection) => {
								return (
									<option key={inspection.id} value={inspection.id}>{inspection['date']}</option>
								)
							})}
						</select>}
					</div>

					<div>
						{currentInspection != null && <>
							<p>Assessor: {currentInspection['assessor']['rank']} {currentInspection['assessor']['account_name']}</p>
							<p>Score: {currentInspection['inspection']['total_score']}</p>
						</>}
					</div>
				</div>

				{currentInspection != null && components.map((component) => {
					return (
						<div key={component.id}>
							<h3>{component.component_name}</h3>
							<ul>
							{componentFields[component.component_name].map((field) => {
								return (
									<li key={field.id}>
										<input type='checkbox' disabled id='{field.id}-field' checked={currentInspection['selected_components'][field.id] != null} className={`${field.description.toLowerCase().includes("missing") ? "field-missing" : ""}`} />
										<label htmlFor={`${field.id}-field`}>{field.description}</label>
									</li>
								)
							})}
							</ul>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export { UniformInspectionResultPage }