import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// To facilitate uniform inspection by officers / primers
const UniformInspectionPage = () => {
	const [inspections, setInspections] = useState();
	const [filters, setFilters] = useState({sec1: true, sec2: true, sec3: true, sec4: true, sec5: true})

	// If there is no ongoing session go back to log in page
	axios.post("/application/0/check_session", {}, {
		withCredentials: true
	})
	.then(response => {
		if (response.data.user?.account_type == 'Boy') window.location.href = '/home'
	})
	.catch(() => { window.location.href = '/' })

	useEffect(() => {
		axios.post('/api/uniform_inspection/0/get_inspections', {}, {
			withCredentials: true  // Include credentials (cookies)
		})
		.then(resp => {
			setInspections(resp.data)
		})
		.catch(resp => handleServerError(resp.response.status))
	}, [])

	function uniformInspectionForm() {
		window.location.href = '/uniform_inspection_form'
	}

	function filter() {
		const search = document.getElementById('search').value.toLowerCase()

		document.querySelectorAll(".uniform-inspection-list-table div").forEach(row => {
			const columns = Array.from(row.children).slice(1, -1)
			const matchesSearch = columns.some(col => col.textContent.toLowerCase().includes(search));
			const matchesSection = filters[row.getAttribute("data-sec")] === true
			row.style.display = matchesSearch && matchesSection ? "contents" : "none";
		})
	}

	function handleCheckboxChange(e) {
		setFilters({...filters, [e.target.id.split('-')[0]]: !filters[e.target.id.split('-')[0]]});
	};
	
	useEffect(() => {
		filter()
	}, [filters])

	return (
		<div className='uniform-inspection-page'>
			<div className='page-container'>
				<div className='uniform-inspection-filter'>
					<div>
						<label htmlFor="search">
							<i className='fa-solid fa-magnifying-glass'></i>
							Search
						</label>
						<input type="search" id="search" name="search" placeholder="Search Boy" onInput={filter} />
					</div>

					<div>					
						<input type="checkbox" id="sec1-filter" defaultChecked={filters.sec1} onChange={handleCheckboxChange} />
						<label htmlFor="sec1-filter">Sec 1</label>
						<input type="checkbox" id="sec2-filter" defaultChecked={filters.sec2} onChange={handleCheckboxChange} />
						<label htmlFor="sec2-filter">Sec 2</label>
						<input type="checkbox" id="sec3-filter" defaultChecked={filters.sec3} onChange={handleCheckboxChange} />
						<label htmlFor="sec3-filter">Sec 3</label>
						<input type="checkbox" id="sec4-filter" defaultChecked={filters.sec4} onChange={handleCheckboxChange} />
						<label htmlFor="sec4-filter">Sec 4</label>
						<input type="checkbox" id="sec5-filter" defaultChecked={filters.sec5} onChange={handleCheckboxChange} />
						<label htmlFor="sec5-filter">Sec 5</label>
					</div>
				</div>

				<h2>Latest Uniform Inspection</h2>
				{inspections != null ? (
				<div className='uniform-inspection-list-table'>
					<p>No.</p>
					<p>Name</p>
					<p>Score</p>
					<p>Date</p>
					<p>Assessor</p>
					<p>Records</p>

					
					{inspections['boys'].map((boy, index) => {
						if (inspections[boy.id] == null) {
							return (
								<div key={boy.account_name} data-sec={"sec" + boy.level}>
									<p>{index + 1}</p>
									<p>{boy.account_name}</p>
									<p>-</p>
									<p>-</p>
									<p>-</p>
									<p>-</p>
								</div>
							)
						}
						else {
							return (
								<div key={inspections[boy.id].id} id={inspections[boy.id].id} data-sec={"sec" + boy.level}>
									<p>{index + 1}</p>
									<p>{boy.account_name}</p>
									<p>{inspections[boy.id].total_score}</p>
									<p>{inspections[boy.id].date}</p>
									<p>{inspections[inspections[boy.id].assessor_id].account_name}</p>
									<p aria-label='View Uniform Inspection Record'><a href={'/view_uniform_inspection/' + inspections[boy.id].id}><i className='fa-solid fa-up-right-from-square'></i></a></p>
								</div>
							)
						}
					})}
				</div>) : (
				<p>No Uniform Inspections Available</p>)}
				
				<button onClick={uniformInspectionForm} id='conduct-inspection-button'>Conduct Inspection</button>
			</div>
		</div>
	)
}

export { UniformInspectionPage }