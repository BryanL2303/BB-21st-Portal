import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// To facilitate uniform inspection by Officers / Primers
const UniformInspectionForm = () => {
	const [boyAccounts, setBoyAccounts] = useState([]); 			// All Boys
	const [boys, setBoys] = useState([]); 							// Selected Boys
	const [components, setComponents] = useState([]);				// Sections (Haircut, Haversack, etc)
	const [componentFields, setComponentFields] = useState({}) 		// Section Fields
	const [selectedContents, setSelectedContents] = useState({});	// Checked Fields Per Section Per Boy
	const [currentForm, setCurrentForm] = useState();				// Selected Boy ID else undefined
	const [sectionCollapse, setSectionCollapse] = useState(false)   // Name List Section Collapse State

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
		})
		.catch(error => { console.error(error) })

		axios.post('/api/account/0/get_accounts_by_type', {
			'account_type': 'Boy'
		}, {
			withCredentials: true  // Include credentials (cookies)
		})
		.then(resp => {
			setBoyAccounts(resp.data)
		})
		.catch(resp => handleServerError(resp.response.status))
	}, [])

	function selectBoy() {
		let boyAccountSelector = document.querySelectorAll('.boy-account-selector:checked')
		let accounts = Array.from(boyAccountSelector, account => account.id)
		
		setSelectedContents(prevContents => {
			let updatedContents = { ...prevContents };
	
			accounts.forEach(account => {
				if (!updatedContents[account]) {
					updatedContents[account] = Object.fromEntries(
						components.map(component => [
							component.id,
							Object.fromEntries(componentFields[component.component_name].map(field => [field.id, false]))
						])
					);
				}
			});
	
			return updatedContents;
		});

		axios.post('/api/account/0/get_accounts_by_ids', { 'boy_ids': accounts }, { withCredentials: true })
		.then(resp => {
			setBoys(resp.data)
			setCurrentForm(resp.data[0].id)
			for (let component in components) {
				let fieldSelector = document.getElementsByClassName(component + '-field-selector')
				for (let field of fieldSelector) {
					field.checked = selectedContents[resp.data[0].id][component][field.id]
				}
			}
		})
		.catch(resp => handleServerError(resp.response.status))
	}

	function selectField(e) {
		let fieldSelector = document.getElementsByClassName(e.target.name + '-field-selector')
		let data = {}
		for (let field of fieldSelector) {
			data[field.id.split("-")[0]] = field.checked
		}
		selectedContents[currentForm][e.target.name] = data
		setSelectedContents(selectedContents)
	}

	function setForm(e) {
		const boyId = e.target.value
		setCurrentForm(boyId)

		if (!selectedContents[boyId]) return

		components.forEach(component => {
			const fieldSelectors = document.getElementsByClassName(`${component.id}-field-selector`)
			Array.from(fieldSelectors).forEach(field => {
				const fieldKey = field.id.split("-")[0];
				field.checked = selectedContents[boyId]?.[component.id]?.[fieldKey] ?? false
			})
		})
	}

	function submitInspection(e) {
		e.preventDefault()

		const confirmed = window.confirm("Are you sure you have finished inspecting? Ensure that all boys selected have been inspected before submission.")
		if (!confirmed) return

		let data = {}
		let date = new Date();
		const formattedDate = date.toLocaleDateString('en-GB');
		boys.map((boy) => {
			data[boy.id] = (selectedContents[boy.id])
		})
		axios.post('/api/uniform_inspection/0/create_uniform_inspection', {
			'selectedContents': data,
			'date': formattedDate,
			'boys': boys
		}, {
			withCredentials: true  // Include credentials (cookies)
		})
		.then(() => {
			window.location.href = '/uniform_inspection_results'
		})
		.catch(resp => handleServerError(resp.response.status))
	}

	return (
		<div className='uniform-inspection-form'>
			<div className='form-selection'>
				<label htmlFor='boy-selector'>Inspecting:</label>
				<select id='boy-selector' onChange={e => setForm(e)} value={currentForm ? currentForm : ''}>
					<option value='' disabled={true}>Select a boy</option>
					{boys.map((boy) => {
						return (
							<option key={boy.id} value={boy.id}>{boy.rank} {boy.account_name}</option>
						)
					})}
				</select>
			</div>

			<div className='page-container'>
				<h2>Uniform Inspection</h2>
				<div>
					<p>Pick the boys to inspect:</p>
					<i className='fa-solid fa-chevron-right' onClick={() => setSectionCollapse(!sectionCollapse)} style={{transform: !sectionCollapse ? 'rotate(90deg)' : 'rotate(0deg)'}}></i>
				</div>

				<div className='boy-selector' style={{height: sectionCollapse ? 0 : 'max-content'}}>
					{boyAccounts.map((boyAccount) => {
						return (
							<React.Fragment key={boyAccount.id}>
								<input type='checkbox' className='boy-account-selector' id={boyAccount.id} onChange={selectBoy}></input>
								<label htmlFor={boyAccount.id}>
									<p>Sec {boyAccount.level} {boyAccount.rank} {boyAccount.account_name}</p>
								</label>
							</React.Fragment>
						)
					})}
				</div>
				
				<form onSubmit={submitInspection}>
					{currentForm != null && components.map((component) => {
						return (
							<div key={component.id}>
								<h3>{component.component_name}</h3>
								<ul>
								{componentFields[component.component_name].map((field) => {
									return (
										<li key={field.id}>
											<input type='checkbox' className={`${component.id}-field-selector ${field.description.toLowerCase().includes("missing") ? "field-missing" : ""}`} id={`${field.id}-field`} name={component.id} onChange={selectField} defaultChecked={selectedContents[currentForm][component.id][field.id]}></input>
											<label htmlFor={`${field.id}-field`}>{field.description}</label>
										</li>
									)
								})}
								</ul>
							</div>
						)
					})}
					<button>Finish Inspection</button>
				</form>
			</div>
		</div>
	)
}

export { UniformInspectionForm }