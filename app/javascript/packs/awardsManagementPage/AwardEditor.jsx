import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError';

// To edit awards information (Administrator)
const AwardEditor = ({ awards }) => {
	const [selectedAward, setSelectedAward] = useState(null);
	const [masteries, setMasteries] = useState([]);
	const [hasMastery, setHasMastery] = useState(false);
	const [level1, setRecommendedLevel1] = useState()
	const [level2, setRecommendedLevel2] = useState()
	const [level3, setRecommendedLevel3] = useState()

	function awardDetails(id) {
		axios.post(`/api/award/${id}/get_award`, {}, { withCredentials: true })
		.then(resp => {
			setSelectedAward(resp.data)
			if (resp.data.has_mastery) {
				setHasMastery(resp.data.has_mastery)

				axios.post(`/api/award/0/get_masteries`, { award_id: id }, { withCredentials: true })
				.then(resp => {
					setMasteries(resp.data)
					setRecommendedLevel1(resp.data[0]?.recommended_level)
					setRecommendedLevel2(resp.data[1]?.recommended_level)
					setRecommendedLevel3(resp.data[2]?.recommended_level)
				})
				.catch(resp => handleServerError(resp.response))
			} else {
				setRecommendedLevel1(resp.data.recommended_level)
			}
		})
		.catch(resp => handleServerError(resp.response))
	}

	function setLevel2(e) {
		if (e.target.getAttribute("data-mastery") == "Advanced") setRecommendedLevel2(e.target.value)
		if (e.target.getAttribute("data-mastery") == "Master") setRecommendedLevel3(e.target.value)
	}

	function editAward(e) {
		e.preventDefault()
		let details = []
		let submit = true
		const form = e.target

		submit = !["badge-name", 2, 3].some(field => form.elements[field].value === '')
		
		if (form.elements["has-mastery"].value === "no") {
			details.push({
				'badge_requirements': form.elements["badge-requirements"].value,
				'results_description': form.elements["results-description"].value,
				'recommended_level': level1,
				'require_certification': form.elements["requires-results"].value === "yes"
			})
		} else {
			submit = ![5, 6, 8, 9].some(field => form.elements[field].value === '')

			details.push({
				'id': e.target[2].getAttribute('data-id'),
				'mastery_requirements': e.target[2].value,
				'results_description': e.target[3].value,
				'recommended_level': level1,
				'require_certification': e.target[4].value === "yes"
			})

			details.push({
				'id': e.target[5].getAttribute('data-id'),
				'mastery_requirements': e.target[5].value,
				'results_description': e.target[6].value,
				'recommended_level': level2,
				'require_certification': e.target[7].value === "yes"
			})

			details.push({
				'id': e.target[8].getAttribute('data-id'),
				'mastery_requirements': e.target[8].value,
				'results_description': e.target[9].value,
				'recommended_level': level3,
				'require_certification': e.target[10].value === "yes"
			})
		}

		if (submit) {
			axios.post(`/api/award/${selectedAward.id}/edit_award`, {
				id: selectedAward.id,
				badge_name: e.target[0].value,
				has_mastery: e.target[1].value === "yes",
				details: details
			}, { withCredentials: true })
			.then(resp => {
				if (resp.data != false) alert("Award has been updated, please refresh the page to update award information")
				else alert("Failed to update")
			})
			.catch(resp => handleServerError(resp.response))
		} else {
			alert("Please fill in all fields first")
		}
	}

	console.log(selectedAward?.badge_name)

	return (
		<div className='award-information'>
			<div>
				<div>
					{awards.map(award => (
						<React.Fragment key={award.badge_name}>
							<input type="radio" id={award.id} name="awards-list" onChange={(e) => awardDetails(e.target.id)} />
							<label htmlFor={award.id}>{award.badge_name}</label>
						</React.Fragment>
					))}
				</div>
			</div>
			
			<hr />
			
			<div>
				{selectedAward ? (
					<form className="edit-award-form" onSubmit={editAward}>
						<label htmlFor='badge-name-input'>Badge name:</label>
						<input type='text' id='badge-name-input' name='badge-name' defaultValue={selectedAward.badge_name} />
						
						<label htmlFor='has-mastery-input'>Badge has mastery levels:</label>
						<select id="has-mastery-input" name="has-mastery" defaultValue={hasMastery == true ? "yes" : "no"} onChange={(e) => setHasMastery(e.target.value === "yes")}>
							<option value="yes">Yes</option>
							<option value="no">No</option>
						</select>
						
						{(selectedAward && !hasMastery) ? (<>
							<label htmlFor='badge-requirements'>Description of badge requirements:</label>
							<textarea id='badge-requirements' name='badge-requirements' defaultValue={selectedAward.badge_requirements}></textarea>
							
							<label htmlFor='results-description'>Description for 32A form results:</label>
							<textarea id='results-description' name='results-description' defaultValue={selectedAward.results_description}></textarea>
							
							<label htmlFor='recommended-level'>Recommended level for completion:</label>
							<select id='recommended-level' defaultValue={selectedAward.recommended_level} onChange={(e) => setRecommendedLevel1(e.target.value)} >
								<option value="1">Secondary 1</option>
								<option value="2">Secondary 2</option>
								<option value="3">Secondary 3</option>
								<option value="4">Secondary 4</option>
								<option value="5">Secondary 5</option>
							</select>
							
							<label htmlFor='requires-results'>Badge requires results:</label>
							<select id='requires-results' name='requires-results' defaultValue={selectedAward.has_results ? "yes" : "no"}>
								<option value="yes">Yes</option>
								<option value="no">No</option>
							</select>
							
							<label htmlFor='requires-pass-fail'>Badge requires pass / fail:</label>
							<select id='requires-pass-fail' defaultValue={selectedAward.has_pass ? "yes" : "no"}>
								<option value="yes">Yes</option>
								<option value="no">No</option>
							</select>
							
							<label htmlFor='requires-custom-description'>Badge requires custom descriptions:</label>
							<select id='requires-custom-description' defaultValue={selectedAward.custom_description ? "yes" : "no"}>
								<option value="yes">Yes</option>
								<option value="no">No</option>
							</select>
							
							{selectedAward.custom_description && <>
								<label>Result description cue (for user input):</label>
								<textarea className='edit-field' defaultValue={selectedAward.description_cue} ></textarea>
							</>}
							
							<label htmlFor='requires-custom-columns'>Badge requires custom columns: </label>
							<select id='requires-custom-columns' defaultValue={selectedAward.has_custom_columns ? "yes" : "no"}>
								<option value="yes">Yes</option>
								<option value="no">No</option>
							</select>

						</>) : (masteries.map((mastery) => (
							<React.Fragment key={mastery.id}>
								<h3>{mastery.mastery_name}</h3>
								
								<label htmlFor={`${mastery.id}-badge-requirements`}>Description of badge requirements:</label>
								<textarea id={`${mastery.id}-badge-requirements`} data-id={mastery.id} defaultValue={mastery.mastery_requirements}></textarea>
								
								{!mastery.custom_description && <>
									<label htmlFor={`${mastery.id}-results-description`}>Description for 32A form results:</label>
									<textarea id={`${mastery.id}-results-description`} defaultValue={mastery.results_description}></textarea>
								</>}

								<label htmlFor={`${mastery.id}-recommended-level`}>Recommended level for completion:</label>
								<select id={`${mastery.id}-recommended-level`} defaultValue={mastery.recommended_level} onChange={(e) => setLevel2(e)} data-mastery={mastery.mastery_name}>
									<option value="1">Secondary 1</option>
									<option value="2">Secondary 2</option>
									<option value="3">Secondary 3</option>
									<option value="4">Secondary 4</option>
									<option value="5">Secondary 5</option>
								</select>
								
								<label htmlFor={`${mastery.id}-requires-results`}>Badge requires results:</label>
								<select id={`${mastery.id}-requires-results`} defaultValue={mastery.has_results ? "yes" : "no"}>
									<option value="yes">Yes</option>
									<option value="no">No</option>
								</select>
								
								<label htmlFor={`${mastery.id}-pass-fail`}>Badge requires pass / fail:</label>
								<select id={`${mastery.id}-pass-fail`} defaultValue={mastery.has_pass ? "yes" : "no"}>
									<option value="yes">Yes</option>
									<option value="no">No</option>
								</select>
								
								<label htmlFor={`${mastery.id}-requires-custom-description`}>Badge requires custom descriptions:</label>
								<select id={`${mastery.id}-requires-custom-description`} defaultValue={mastery.custom_description ? "yes" : "no"}>
									<option value="yes">Yes</option>
									<option value="no">No</option>
								</select>
								
								{mastery.custom_description && <>
									<label htmlFor={`${mastery.id}-custom-description`}>Result description cue (for user input):</label>
									<textarea id={`${mastery.id}-custom-description`} defaultValue={mastery.description_cue}></textarea>
								</>}

								<label htmlFor={`${mastery.id}-requires-custom-columns`}>Badge requires custom columns:</label>
								<select id={`${mastery.id}-requires-custom-columns`} defaultValue={mastery.has_custom_columns ? "yes" : "no"}>
									<option value="yes">Yes</option>
									<option value="no">No</option>
								</select>
							</React.Fragment>
						)))}

						<button>Submit</button>
					</form>
				) : <p>Select an Award</p>}
			</div>
		</div>
	)
}

AwardEditor.propTypes = {
	awards: PropTypes.array.isRequired
}

export { AwardEditor }