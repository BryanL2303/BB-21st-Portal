import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { handleServerError } from '../general/handleServerError'

// To view awards information and delete award accounts
const AwardInformation = ({ awards }) => {
	const [selectedAward, setSelectedAward] = useState(null); 	// Selected Award Details (Object or NULL)
	const [masteries, setMasteries] = useState([]);				// Selected Award Masteries (List of Objects)

	function awardDetails(id) {
		axios.post(`/api/award/${id}/get_award`, {}, { withCredentials: true })
		.then(resp => {
			if (resp.data['has_mastery']) {
				setSelectedAward(resp.data)

				axios.post(`/api/award/0/get_masteries`, { award_id: id }, { withCredentials: true })
				.then(resp => {
					setMasteries(resp.data.map(mastery => cleanUpData(mastery, 'mastery_requirements')))
				})
				.catch(resp => handleServerError(resp.response.status))
			} else {
				setSelectedAward(cleanUpData(resp.data, 'badge_requirements'))
			}
		})
		.catch(resp => handleServerError(resp.response.status))
	}

	function cleanUpData(data, requirement_key) {
		const linkRegex = /(https?:\/\/[^\s]+)/g;
		const links = data[requirement_key].match(linkRegex);
		const cleanedDescription = data[requirement_key].replace(/Read more about the requirements( here)?:?\s?(https?:\/\/\S+)?/, '').trim();

		return {
			...data,
			[requirement_key]: cleanedDescription,
			link: links ? links[0] : null
		};
	}

	return (
		<div className='award-information'>
			<div>
				{awards.map(award => (
					<React.Fragment key={award.badge_name}>
						<input type="radio" id={award.id} name="awards-list" onChange={(e) => awardDetails(e.target.id)} />
						<label htmlFor={award.id}>{award.badge_name}</label>
					</React.Fragment>
				))}
			</div>
			
			<hr />

			<div>
				{selectedAward ? <>
					<div>
						<h1>{selectedAward.badge_name}</h1>
						<a href={selectedAward.link} target="_blank" rel="noreferrer" aria-label='Learn More' title='Learn More'>
							<i className='fa-solid fa-book-open-cover'></i>
						</a>
					</div>
						
					{!selectedAward.has_mastery &&
					<div className='mastery-level'>
						<div>
							<h2>Description</h2>
							<span title='Recommended level for completion'>Sec {selectedAward.recommended_level}</span>
						</div>

						<p>{selectedAward.badge_requirements}</p>
					</div>}

					{selectedAward.has_mastery && masteries.map((mastery) => (
						<div className='mastery-level' key={selectedAward.id + ' ' + mastery.id}>
							<div>
								<h2>{mastery.mastery_name}</h2>
								<span title='Recommended level for completion'>Sec {mastery.recommended_level}</span>
							</div>

							<p>{mastery.mastery_requirements}</p>
						</div>
					))}
				</> : <p>Select an Award</p>}
			</div>	
		</div>
	)
}

AwardInformation.propTypes = {
	awards: PropTypes.array.isRequired
}

export { AwardInformation }